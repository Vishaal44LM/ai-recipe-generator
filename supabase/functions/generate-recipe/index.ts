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
    const { ingredients, dietary, servings } = await req.json();
    console.log("Generating recipe for:", { ingredients, dietary, servings });

    if (!ingredients || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No ingredients provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const dietaryText = dietary && dietary !== "none" ? dietary : "no dietary restrictions";
    
    const systemPrompt = `You are an expert chef and recipe creator. Generate creative, delicious, and practical recipes based on the ingredients provided. Always respond with ONLY valid JSON matching this exact structure:

{
  "title": "Recipe Name",
  "cookingTime": "X minutes",
  "servings": number,
  "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity"],
  "steps": ["Step 1", "Step 2"],
  "tips": "Chef's tips and suggestions",
  "nutrition": {
    "calories": "X kcal",
    "protein": "Xg",
    "fat": "Xg",
    "carbs": "Xg"
  },
  "pairing": "Wine or beverage pairing suggestion"
}

Make the recipe realistic, achievable, and delicious. Include specific quantities for all ingredients.`;

    const userPrompt = `Create a recipe for ${servings} servings using these ingredients: ${ingredients.join(", ")}. 
Dietary preference: ${dietaryText}.

Requirements:
- Use the provided ingredients creatively
- Adjust the recipe to match the ${dietaryText} dietary preference
- Provide realistic cooking times
- Include specific quantities for all ingredients
- Make sure nutritional info matches the dietary preference
- Return ONLY the JSON object, no additional text`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
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
          JSON.stringify({ error: "AI service credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate recipe" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const recipeText = data.choices?.[0]?.message?.content;
    
    if (!recipeText) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Failed to generate recipe" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse the JSON response from AI
    let recipe;
    try {
      // Remove any markdown code blocks if present
      const cleanedText = recipeText.replace(/```json\n?|\n?```/g, "").trim();
      recipe = JSON.parse(cleanedText);
      console.log("Successfully generated recipe:", recipe.title);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw response:", recipeText);
      return new Response(
        JSON.stringify({ error: "Failed to parse recipe data" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ recipe }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-recipe function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
