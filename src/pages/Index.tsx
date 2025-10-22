import { useState } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";
import { toast } from "sonner";

interface Recipe {
  title: string;
  cookingTime: string;
  servings: number;
  ingredients: string[];
  steps: string[];
  tips?: string;
  nutrition?: {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
  };
  pairing?: string;
}

const Index = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (ingredients: string[], dietary: string, servings: number) => {
    setIsLoading(true);
    setRecipe(null);

    try {
      // Simulated API call - will be replaced with actual Lovable AI integration
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock recipe data
      const mockRecipe: Recipe = {
        title: "Mediterranean Herb Chicken",
        cookingTime: "25 minutes",
        servings: servings,
        ingredients: ingredients.map(ing => `${Math.floor(Math.random() * 3) + 1} ${ing}`),
        steps: [
          "Preheat your oven to 375°F (190°C).",
          "Season the main protein with herbs and spices.",
          "Heat oil in a pan over medium-high heat.",
          "Sear the protein for 3-4 minutes on each side until golden.",
          "Transfer to the oven and bake for 15 minutes.",
          "Let rest for 5 minutes before serving."
        ],
        tips: "For extra flavor, marinate the ingredients for 30 minutes before cooking. Serve with fresh herbs and a squeeze of lemon.",
        nutrition: {
          calories: "320 kcal",
          protein: "38g",
          fat: "12g",
          carbs: dietary === "keto" ? "3g" : "15g"
        },
        pairing: "A crisp Sauvignon Blanc or light Pinot Grigio"
      };

      setRecipe(mockRecipe);
      toast.success("Recipe generated successfully!");
    } catch (error) {
      toast.error("Failed to generate recipe. Please try again.");
      console.error("Error generating recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Fresh ingredients"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
            AI Recipe Generator
          </h1>
          <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md animate-fade-in">
            Turn your ingredients into delicious recipes with the power of AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!isLoading && !recipe && (
          <RecipeForm onGenerate={handleGenerate} isLoading={isLoading} />
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
            <p className="text-lg text-muted-foreground">Crafting your perfect recipe...</p>
          </div>
        )}

        {!isLoading && recipe && (
          <div className="space-y-6">
            <RecipeDisplay recipe={recipe} />
            <div className="text-center">
              <button
                onClick={() => setRecipe(null)}
                className="text-primary hover:text-primary/80 underline font-medium transition-colors"
              >
                ← Generate Another Recipe
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>AI Recipe Generator • Built with Lovable</p>
          <p className="mt-2">
            Powered by AI to help you create amazing dishes from what you have
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
