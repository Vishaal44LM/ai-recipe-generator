import { useState } from "react";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: { ingredients, dietary, servings }
      });

      if (error) {
        console.error("Error generating recipe:", error);
        toast.error(error.message || "Failed to generate recipe. Please try again.");
        return;
      }

      if (!data?.recipe) {
        toast.error("Failed to generate recipe. Please try again.");
        return;
      }

      setRecipe(data.recipe);
      toast.success("Recipe generated successfully!");
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast.error("Failed to generate recipe. Please try again.");
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
