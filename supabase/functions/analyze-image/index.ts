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
    const { imageBase64, learningMode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!imageBase64) {
      throw new Error("No image provided");
    }

    const modeContext = learningMode === 'dyslexia' 
      ? "The user has dyslexia. Use simple words, short sentences, and bullet points. Avoid complex vocabulary."
      : learningMode === 'adhd'
      ? "The user has ADHD. Keep explanations very brief and engaging. Use emojis and break information into tiny chunks."
      : "Keep explanations clear and engaging for all learners.";

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
            content: `You are a friendly educational AI assistant helping neurodivergent learners understand images. ${modeContext}

Your task is to analyze the image and provide a helpful educational explanation.

IMPORTANT: Always respond with valid JSON in exactly this format:
{
  "title": "A short, descriptive title for what you see (max 6 words)",
  "points": [
    "First key observation with an emoji at the start",
    "Second key observation with an emoji at the start", 
    "Third key observation with an emoji at the start",
    "Fourth key observation with an emoji at the start"
  ],
  "tip": "A helpful learning tip related to the image content",
  "voiceDescription": "A natural, flowing description of the image suitable for text-to-speech. Describe what you see clearly and helpfully in 2-3 sentences."
}

Make each response unique and specific to the actual image content. Never give generic responses.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this image and provide an educational explanation. Be specific about what you see."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
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
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from the AI
    let parsedContent;
    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback response if parsing fails
      parsedContent = {
        title: "Image Analysis",
        points: [
          "📷 I can see an interesting image here",
          "🔍 Let me help you understand what's shown",
          "💡 This image contains visual information to explore",
          "✨ Try looking at the main elements first"
        ],
        tip: "Take your time to observe all the details in the image!",
        voiceDescription: "This image shows interesting visual content. Take your time to explore what you see and connect it to what you already know."
      };
    }

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-image:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to analyze image" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
