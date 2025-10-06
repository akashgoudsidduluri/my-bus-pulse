import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, UserPlus, Trash2, Bus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VehicleOperator {
  id: string;
  user_id: string;
  vehicle_id: string;
  assigned_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'operator' | 'user';
}

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleOperators, setVehicleOperators] = useState<VehicleOperator[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    userId: "",
    vehicleId: ""
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadVehicleOperators();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const loadVehicleOperators = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_operators')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setVehicleOperators(data || []);
    } catch (error) {
      console.error('Error loading vehicle operators:', error);
      toast({
        title: "Error",
        description: "Failed to load vehicle operators",
        variant: "destructive"
      });
    }
  };

  const handleAssignVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAssignment.userId || !newAssignment.vehicleId) {
      toast({
        title: "Validation Error",
        description: "Please provide both User ID and Vehicle ID",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicle_operators')
        .insert({
          user_id: newAssignment.userId,
          vehicle_id: newAssignment.vehicleId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle assigned to operator successfully"
      });

      setNewAssignment({ userId: "", vehicleId: "" });
      loadVehicleOperators();
    } catch (error: any) {
      toast({
        title: "Assignment Failed",
        description: error.message || "Failed to assign vehicle",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicle_operators')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vehicle assignment removed"
      });

      loadVehicleOperators();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove assignment",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-navbus-blue mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-navbus-blue/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-navbus-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Admin <span className="text-navbus-blue">Panel</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage vehicle operator assignments
            </p>
          </div>

          <div className="grid gap-8">
            {/* Assign Vehicle Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="w-5 h-5" />
                  Assign Vehicle to Operator
                </CardTitle>
                <CardDescription>
                  Grant operators permission to submit position data for specific vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAssignVehicle} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="userId" className="block text-sm font-medium mb-2">
                        User ID
                      </label>
                      <Input
                        id="userId"
                        type="text"
                        placeholder="Enter user UUID"
                        value={newAssignment.userId}
                        onChange={(e) => setNewAssignment({ ...newAssignment, userId: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="vehicleId" className="block text-sm font-medium mb-2">
                        Vehicle ID
                      </label>
                      <Input
                        id="vehicleId"
                        type="text"
                        placeholder="Enter vehicle ID (e.g., BUS-001)"
                        value={newAssignment.vehicleId}
                        onChange={(e) => setNewAssignment({ ...newAssignment, vehicleId: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="hero" className="w-full md:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Assign Vehicle
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Current Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Current Vehicle Assignments</CardTitle>
                <CardDescription>
                  View and manage all vehicle-operator assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {vehicleOperators.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No vehicle assignments yet
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Vehicle ID</TableHead>
                          <TableHead>Assigned At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicleOperators.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-mono text-xs">
                              {assignment.user_id.substring(0, 8)}...
                            </TableCell>
                            <TableCell className="font-semibold">
                              {assignment.vehicle_id}
                            </TableCell>
                            <TableCell>
                              {new Date(assignment.assigned_at).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveAssignment(assignment.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}