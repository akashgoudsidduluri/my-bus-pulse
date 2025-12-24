import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Users, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CrowdResult {
  crowdLevel: "low" | "medium" | "high" | "very_high" | "unknown";
  estimatedCount: number;
  percentageFull: number;
  description: string;
  recommendation: string;
}

export function CrowdDetector() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<CrowdResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setImagePreview(base64);
      await analyzeImage(base64.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("detect-crowd", {
        body: { imageBase64 },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Crowd level: ${data.crowdLevel}`,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500 bg-green-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      case "high":
        return "text-orange-500 bg-orange-500/10";
      case "very_high":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getCrowdLabel = (level: string) => {
    switch (level) {
      case "low":
        return "Low - Plenty of seats";
      case "medium":
        return "Medium - Some seats available";
      case "high":
        return "High - Standing room only";
      case "very_high":
        return "Very High - Very crowded";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-navbus-blue" />
          AI Crowd Detection
        </CardTitle>
        <CardDescription>
          Upload a photo of a bus or bus stop to analyze crowd levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-navbus-blue hover:bg-navbus-blue/5 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg object-contain"
              />
              <p className="text-sm text-muted-foreground">
                Click to upload a different image
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-navbus-blue/10 rounded-full">
                <Camera className="h-8 w-8 text-navbus-blue" />
              </div>
              <div>
                <p className="font-medium">Click to upload an image</p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or WebP (max 5MB)
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="h-6 w-6 animate-spin text-navbus-blue" />
            <span className="text-muted-foreground">Analyzing crowd levels...</span>
          </div>
        )}

        {/* Results */}
        {result && !isAnalyzing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Crowd Level */}
              <div className={`rounded-xl p-4 ${getCrowdColor(result.crowdLevel)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Crowd Level</span>
                </div>
                <p className="text-lg font-bold capitalize">
                  {result.crowdLevel.replace("_", " ")}
                </p>
                <p className="text-sm opacity-80">{getCrowdLabel(result.crowdLevel)}</p>
              </div>

              {/* Capacity */}
              <div className="rounded-xl p-4 bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Capacity</span>
                </div>
                <p className="text-lg font-bold">{result.percentageFull}%</p>
                <p className="text-sm text-muted-foreground">
                  ~{result.estimatedCount} people visible
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl p-4 bg-muted">
              <p className="text-sm">{result.description}</p>
            </div>

            {/* Recommendation */}
            <div className="rounded-xl p-4 bg-navbus-blue/10 border border-navbus-blue/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-navbus-blue mt-0.5" />
                <div>
                  <p className="font-medium text-navbus-blue">Recommendation</p>
                  <p className="text-sm">{result.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}