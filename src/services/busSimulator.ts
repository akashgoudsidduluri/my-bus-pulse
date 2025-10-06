import { supabase } from "@/integrations/supabase/client";

// Simulator that generates realistic bus movements
export class BusSimulator {
  private intervalId: NodeJS.Timeout | null = null;
  private buses: Map<string, { lat: number; lon: number; route: string }> = new Map();

  constructor() {
    // Initialize mock buses with routes in Hyderabad
    this.buses.set('TSRTC-45A-001', { lat: 17.4239, lon: 78.4521, route: '45A' });
    this.buses.set('TSRTC-23B-002', { lat: 17.4486, lon: 78.4712, route: '23B' });
    this.buses.set('TSRTC-10H-003', { lat: 17.4399, lon: 78.4983, route: '10H' });
    this.buses.set('TSRTC-49M-004', { lat: 17.3955, lon: 78.4346, route: '49M' });
    this.buses.set('TSRTC-8C-005', { lat: 17.3850, lon: 78.4867, route: '8C' });
    this.buses.set('TSRTC-218D-006', { lat: 17.3536, lon: 78.5286, route: '218D' });
  }

  async start() {
    console.log('🚌 Starting bus simulator...');
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ User must be authenticated to start simulator');
      return;
    }
    
    // Assign current user as operator for all simulated vehicles
    const vehicleIds = Array.from(this.buses.keys());
    const assignments = vehicleIds.map(vehicle_id => ({
      user_id: user.id,
      vehicle_id
    }));
    
    const { error: assignError } = await supabase
      .from('vehicle_operators')
      .upsert(assignments, { 
        onConflict: 'user_id,vehicle_id',
        ignoreDuplicates: true 
      });
    
    if (assignError) {
      console.error('❌ Error assigning vehicles to user:', assignError);
      return;
    }
    
    console.log(`✅ Assigned ${vehicleIds.length} vehicles to current user`);
    
    // Send initial positions
    await this.sendAllPositions();
    
    // Update positions every 5 seconds
    this.intervalId = setInterval(async () => {
      await this.sendAllPositions();
    }, 5000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('🛑 Bus simulator stopped');
    }
  }

  private async sendAllPositions() {
    const positions = [];
    
    for (const [vehicleId, bus] of this.buses) {
      // Simulate realistic movement (small random changes)
      bus.lat += (Math.random() - 0.5) * 0.0015;
      bus.lon += (Math.random() - 0.5) * 0.0015;
      
      const position = {
        vehicle_id: vehicleId,
        lat: bus.lat,
        lon: bus.lon,
        speed: +(20 + Math.random() * 30).toFixed(1),
        heading: Math.floor(Math.random() * 360),
        ts: new Date().toISOString()
      };
      
      positions.push(position);
    }
    
    const { error } = await supabase.from('positions').insert(positions);
    
    if (error) {
      console.error('❌ Error inserting positions:', error);
    } else {
      console.log(`✅ Sent ${positions.length} position updates`);
    }
  }
}

// Singleton instance
let simulatorInstance: BusSimulator | null = null;

export const getSimulator = () => {
  if (!simulatorInstance) {
    simulatorInstance = new BusSimulator();
  }
  return simulatorInstance;
};
