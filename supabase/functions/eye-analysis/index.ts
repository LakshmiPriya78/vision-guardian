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
    const { imageBase64, eyeMetrics, analysisType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Received analysis request:", { analysisType, hasImage: !!imageBase64 });

    let systemPrompt = "";
    let userPrompt = "";

    if (analysisType === "ophthalmic") {
      systemPrompt = `You are AEGIS, an advanced AI ophthalmologist and neurologist assistant. You analyze eye images and biometric data to provide comprehensive health assessments.

Your capabilities:
- Analyze pupil characteristics (size, reactivity, symmetry)
- Detect signs of eye strain, fatigue, and stress
- Identify potential neurological indicators from pupil responses
- Assess digital eye strain (Computer Vision Syndrome)
- Evaluate blink patterns and tear film quality indicators
- Detect potential signs of conditions (for educational purposes only)

IMPORTANT: You are an AI assistant for educational and informational purposes only. Always recommend consulting a healthcare professional for actual medical diagnoses.

Provide your analysis in this structured format:
1. **Eye Health Assessment** - Overall eye condition observations
2. **Pupil Analysis** - Size, symmetry, reactivity
3. **Strain Indicators** - Signs of digital eye strain
4. **Neurological Indicators** - Any patterns suggesting neurological status
5. **Recommendations** - Practical suggestions for eye health
6. **Risk Level** - LOW/MODERATE/HIGH with explanation`;

      userPrompt = `Analyze this eye/face image for ophthalmic and neurological health indicators.

Current biometric readings:
- Pupil Diameter: ${eyeMetrics?.pupilDiameter || "N/A"} mm
- Blink Rate: ${eyeMetrics?.blinkRate || "N/A"} per minute
- Reflex Latency: ${eyeMetrics?.reflexLatency || "N/A"} ms
- DESI Score: ${eyeMetrics?.desiScore || "N/A"}
- MSRF Level: ${eyeMetrics?.msrfLevel || "N/A"}%

Provide a comprehensive ophthalmic and neurological assessment based on the image and these metrics.`;

    } else if (analysisType === "neurological") {
      systemPrompt = `You are AEGIS, an advanced AI neurologist assistant specializing in pupillary and ocular assessments.

Your focus areas:
- Pupillary light reflex analysis
- Pupil size asymmetry (anisocoria detection)
- Response latency patterns
- Eye movement assessment
- Fatigue and cognitive load indicators
- Circadian rhythm impact on visual system

IMPORTANT: Educational purposes only. Always recommend professional consultation.

Provide analysis in this format:
1. **Neurological Status** - Overall assessment
2. **Pupillary Reflexes** - Response quality and timing
3. **Cognitive Load Indicators** - Signs of mental fatigue
4. **Circadian Assessment** - Sleep/wake cycle indicators
5. **Recommendations** - Neurological health suggestions`;

      userPrompt = `Perform a neurological assessment based on pupillary and ocular indicators.

Biometric data:
- Pupil Diameter: ${eyeMetrics?.pupilDiameter || "N/A"} mm
- Reflex Latency: ${eyeMetrics?.reflexLatency || "N/A"} ms
- Blink Rate Variability: ${eyeMetrics?.blinkRate || "N/A"}/min
- Current Time: ${new Date().toLocaleTimeString()}

Analyze neurological health indicators from this data and image.`;

    } else {
      systemPrompt = `You are AEGIS, a comprehensive AI health assessment system analyzing eye and facial biometrics for overall wellness indicators.`;
      userPrompt = `Provide a general health assessment based on the visible indicators.`;
    }

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (imageBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: userPrompt });
    }

    console.log("Calling AI gateway for analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to generate analysis";

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis, timestamp: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in eye-analysis function:", error);
    const errorMessage = error instanceof Error ? error.message : "Analysis failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
