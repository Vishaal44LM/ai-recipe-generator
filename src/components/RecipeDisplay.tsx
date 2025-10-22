import { Download, Clock, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface RecipeDisplayProps {
  recipe: Recipe;
}

export const RecipeDisplay = ({ recipe }: RecipeDisplayProps) => {
  const handleDownloadTxt = () => {
    const content = `
${recipe.title}
${"=".repeat(recipe.title.length)}

Cooking Time: ${recipe.cookingTime}
Servings: ${recipe.servings}

INGREDIENTS:
${recipe.ingredients.map((ing, i) => `${i + 1}. ${ing}`).join("\n")}

STEPS:
${recipe.steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

${recipe.tips ? `CHEF'S TIPS:\n${recipe.tips}\n` : ""}
${recipe.pairing ? `WINE PAIRING:\n${recipe.pairing}\n` : ""}
${
  recipe.nutrition
    ? `NUTRITION (per serving):\nCalories: ${recipe.nutrition.calories}\nProtein: ${recipe.nutrition.protein}\nFat: ${recipe.nutrition.fat}\nCarbs: ${recipe.nutrition.carbs}`
    : ""
}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Recipe downloaded as TXT!");
  };

  const handleCopyToClipboard = () => {
    const content = `${recipe.title}\n\nCooking Time: ${recipe.cookingTime}\nServings: ${recipe.servings}\n\nIngredients:\n${recipe.ingredients.join("\n")}\n\nSteps:\n${recipe.steps.join("\n")}`;
    navigator.clipboard.writeText(content);
    toast.success("Recipe copied to clipboard!");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Card className="p-6 shadow-hover border-border">
        {/* Header */}
        <div className="border-b border-border pb-4 mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-3">{recipe.title}</h2>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{recipe.cookingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2 text-card-foreground">
                <span className="text-primary font-semibold">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-3">Cooking Steps</h3>
          <ol className="space-y-3">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3 text-card-foreground">
                <Badge variant="secondary" className="h-6 w-6 rounded-full flex items-center justify-center shrink-0">
                  {index + 1}
                </Badge>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Chef's Tips */}
        {recipe.tips && (
          <div className="mb-6 p-4 bg-accent/20 rounded-lg border border-accent/30">
            <h3 className="text-lg font-semibold text-accent-foreground mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Chef's Tips
            </h3>
            <p className="text-sm text-accent-foreground/90">{recipe.tips}</p>
          </div>
        )}

        {/* Wine Pairing */}
        {recipe.pairing && (
          <div className="mb-6 p-4 bg-secondary/20 rounded-lg border border-secondary/30">
            <h3 className="text-lg font-semibold text-secondary-foreground mb-2">Wine Pairing</h3>
            <p className="text-sm text-secondary-foreground/90">{recipe.pairing}</p>
          </div>
        )}

        {/* Nutrition */}
        {recipe.nutrition && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Nutrition (per serving)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Calories</p>
                <p className="font-semibold text-foreground">{recipe.nutrition.calories}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Protein</p>
                <p className="font-semibold text-foreground">{recipe.nutrition.protein}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Fat</p>
                <p className="font-semibold text-foreground">{recipe.nutrition.fat}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                <p className="font-semibold text-foreground">{recipe.nutrition.carbs}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
          <Button onClick={handleDownloadTxt} variant="default">
            <Download className="mr-2 h-4 w-4" />
            Download TXT
          </Button>
          <Button onClick={handleCopyToClipboard} variant="secondary">
            <FileText className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
