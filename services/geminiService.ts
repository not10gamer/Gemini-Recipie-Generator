import { GoogleGenAI } from "@google/genai";
import type { Recipe, Ingredient, SourceLink } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecipes = async (ingredients: Ingredient[], desiredDish: string, strictIngredients: boolean): Promise<Recipe[]> => {
  const ingredientsList = ingredients.map(i => `${i.name} (${i.quantity})`).join(', ');
  
  let prompt = `
    You are a creative chef. Generate 3 diverse and delicious recipes that primarily use the following ingredients I have: ${ingredientsList}.
  `;

  if (desiredDish.trim()) {
    prompt += ` I would prefer to make something like a "${desiredDish.trim()}". Please prioritize recipes of that type if possible.`;
  }

  if (strictIngredients) {
    prompt += ` You MUST ONLY use the ingredients I have provided. You may assume I also have water, salt, and pepper. Do not include any other ingredients.`;
  } else {
    prompt += ` You can include common pantry staples like oil, salt, pepper, flour, sugar, and water if necessary.`;
  }

  prompt += `
    Use your web search tool to find relevant links for cooking techniques, ingredient information, or similar online recipes that could be helpful.
    Ensure the recipes are clear, concise, and easy for a home cook to follow.
    CRITICALLY IMPORTANT: The final output must be a single, valid JSON array of recipe objects. Do not include any other text, markdown, or explanations outside of the JSON array. The JSON schema should be:
    [
      {
        "recipeName": "string",
        "description": "string",
        "calories": "string (e.g., 'Approx. 500 kcal per serving')",
        "timeTaken": "string (e.g., '45 minutes')",
        "ingredients": ["string"],
        "instructions": ["string"]
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract and parse JSON from the response text
    let responseText = response.text.trim();
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```|(\[[\s\S]*\])/);

    if (!jsonMatch) {
      console.error("Raw response:", responseText);
      throw new Error("Could not find a valid JSON array in the response.");
    }
    responseText = jsonMatch[1] || jsonMatch[2];
    const parsedRecipes: Omit<Recipe, 'sourceLinks' | 'imageBase64'>[] = JSON.parse(responseText);
    
    // Basic validation
    if (!Array.isArray(parsedRecipes) || parsedRecipes.some(r => !r.recipeName || !r.calories || !r.timeTaken)) {
        throw new Error("Invalid recipe format received from API.");
    }

    // Extract grounding metadata for source links
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sourceLinks: SourceLink[] = groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!(web && web.uri && web.title)) || [];
    
    // Generate images for each recipe and combine all data
    const finalRecipes = await Promise.all(
        parsedRecipes.map(async (recipe) => {
            let imageBase64: string | undefined = undefined;
            try {
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: `A delicious, professionally photographed, appetizing photo of "${recipe.recipeName}". High quality, food photography.`,
                    config: {
                        numberOfImages: 1,
                        outputMimeType: 'image/jpeg',
                        aspectRatio: '16:9',
                    },
                });
                imageBase64 = imageResponse.generatedImages?.[0]?.image?.imageBytes;
            } catch (imageError) {
                console.error(`Failed to generate image for recipe: ${recipe.recipeName}`, imageError);
                // Silently fail, so the recipe is still shown without an image.
            }

            return {
                ...recipe,
                imageBase64,
                sourceLinks: sourceLinks.length > 0 ? sourceLinks : undefined,
            };
        })
    );
    
    return finalRecipes;

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes from the Gemini API.");
  }
};