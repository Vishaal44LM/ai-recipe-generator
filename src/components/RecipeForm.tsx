import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChefHat } from "lucide-react";
import { toast } from "sonner";

interface RecipeFormProps {
  onGenerate: (ingredients: string[], dietary: string, servings: number) => void;
  isLoading: boolean;
}

export const RecipeForm = ({ onGenerate, isLoading }: RecipeFormProps) => {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietary, setDietary] = useState("none");
  const [servings, setServings] = useState(2);

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    
    if (ingredients.includes(trimmed)) {
      toast.error("This ingredient is already added");
      return;
    }
    
    setIngredients([...ingredients, trimmed]);
    setIngredientInput("");
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }
    onGenerate(ingredients, dietary, servings);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-card rounded-lg p-6 shadow-card border border-border">
        <div className="space-y-4">
          {/* Ingredients Input */}
          <div className="space-y-2">
            <Label htmlFor="ingredient" className="text-base font-semibold">
              Your Ingredients
            </Label>
            <div className="flex gap-2">
              <Input
                id="ingredient"
                placeholder="e.g., chicken, garlic, lemon..."
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleAddIngredient}
                size="icon"
                variant="secondary"
                disabled={!ingredientInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Ingredient Tags */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-slide-in">
              {ingredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                >
                  {ingredient}
                  <X
                    className="ml-2 h-3 w-3"
                    onClick={() => handleRemoveIngredient(ingredient)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Dietary Preference */}
          <div className="space-y-2">
            <Label htmlFor="dietary" className="text-base font-semibold">
              Dietary Preference
            </Label>
            <Select value={dietary} onValueChange={setDietary}>
              <SelectTrigger id="dietary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Restriction</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                <SelectItem value="pescatarian">Pescatarian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Servings */}
          <div className="space-y-2">
            <Label htmlFor="servings" className="text-base font-semibold">
              Number of Servings
            </Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setServings(Math.max(1, servings - 1))}
              >
                -
              </Button>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center"
                min="1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setServings(servings + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="hero"
            size="lg"
            onClick={handleGenerate}
            disabled={isLoading || ingredients.length === 0}
            className="w-full mt-6"
          >
            <ChefHat className="mr-2 h-5 w-5" />
            {isLoading ? "Crafting Your Recipe..." : "Generate Recipe"}
          </Button>
        </div>
      </div>
    </div>
  );
};
