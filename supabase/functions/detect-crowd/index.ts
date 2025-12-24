import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a crowd detection AI for a bus tracking system. Analyze images and estimate crowd levels.
            
Your response must be a JSON object with exactly these fields:
- crowdLevel: "low" | "medium" | "high" | "very_high"
- estimatedCount: number (approximate number of people visible)
- percentageFull: number (0-100, estimated capacity utilization)
- description: string (brief description of the scene)
- recommendation: string (travel recommendation based on crowd)

Crowd level guidelines:
- low: 0-25% full, plenty of seats
- medium: 25-50% full, some seats available
- high: 50-75% full, standing room only
- very_high: 75-100% full, very crowded

Always respond with valid JSON only, no markdown.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this bus/transport image and provide crowd detection results."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze image");
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let crowdData;
    try {
      crowdData = JSON.parse(aiContent);
    } catch {
      // If JSON parsing fails, return a default response
      crowdData = {
        crowdLevel: "unknown",
        estimatedCount: 0,
        percentageFull: 0,
        description: aiContent,
        recommendation: "Unable to analyze crowd level"
      };
    }

    return new Response(
      JSON.stringify(crowdData),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in detect-crowd function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});