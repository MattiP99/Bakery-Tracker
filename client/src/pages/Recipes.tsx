import { useState } from "react";
import { useRecipes, useCreateRecipe, useRecipe, useAddRecipeIngredient, useRemoveRecipeIngredient, useIngredients } from "@/hooks/use-food-cost";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, ChefHat, Euro, Trash2, ChevronRight, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertRecipeSchema, insertRecipeIngredientSchema } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

// === RECIPE CREATION FORM ===
const recipeSchema = insertRecipeSchema;

function CreateRecipeForm({ onClose }: { onClose: () => void }) {
  const createMutation = useCreateRecipe();
  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: { name: "", description: "", yieldAmount: 1 },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(d => createMutation.mutate(d, { onSuccess: onClose }))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Name</FormLabel>
              <FormControl><Input placeholder="e.g. Tiramisu" {...field} /></FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl><Textarea placeholder="Notes regarding preparation..." {...field} /></FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yieldAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yield (Servings)</FormLabel>
              <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary text-white" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create Recipe"}
        </Button>
      </form>
    </Form>
  );
}

// === ADD INGREDIENT TO RECIPE FORM ===
function AddIngredientForm({ recipeId, onClose }: { recipeId: number, onClose: () => void }) {
  const { data: ingredients } = useIngredients();
  const addMutation = useAddRecipeIngredient();
  
  const form = useForm({
    resolver: zodResolver(insertRecipeIngredientSchema),
    defaultValues: { recipeId, ingredientId: 0, amountGrams: 0 },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(d => addMutation.mutate(d, { onSuccess: onClose }))} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="ingredientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredient</FormLabel>
              <Select onValueChange={v => field.onChange(parseInt(v))}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ingredient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ingredients?.map(ing => (
                    <SelectItem key={ing.id} value={ing.id.toString()}>
                      {ing.name} (€{(ing.pricePerKg/100).toFixed(2)}/kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amountGrams"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (grams)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary text-white" disabled={addMutation.isPending}>
          Add to Recipe
        </Button>
      </form>
    </Form>
  );
}

// === RECIPE DETAIL VIEW ===
function RecipeDetail({ id }: { id: number }) {
  const { data: recipe, isLoading } = useRecipe(id);
  const removeMutation = useRemoveRecipeIngredient();
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);

  if (isLoading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-32 w-full" /></div>;
  if (!recipe) return <div className="p-8 text-center text-muted-foreground">Recipe not found</div>;

  const totalCostCents = recipe.ingredients.reduce((acc, curr) => {
    return acc + (curr.ingredient.pricePerKg * (curr.amountGrams / 1000));
  }, 0);

  const costPerServing = totalCostCents / (recipe.yieldAmount || 1);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">{recipe.name}</h2>
            <p className="text-sm text-muted-foreground max-w-md">{recipe.description || "No description provided."}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Total Cost</p>
            <p className="text-3xl font-display font-bold text-primary">€ {(totalCostCents / 100).toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-1">€ {(costPerServing / 100).toFixed(2)} per serving</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary" />
            Ingredients
          </h3>
          <Dialog open={isAddingIngredient} onOpenChange={setIsAddingIngredient}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Plus className="w-4 h-4 mr-1" /> Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Ingredient</DialogTitle></DialogHeader>
              <AddIngredientForm recipeId={recipe.id} onClose={() => setIsAddingIngredient(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {recipe.ingredients.length === 0 ? (
            <div className="p-8 text-center bg-secondary/30 rounded-xl border border-dashed border-border text-muted-foreground">
              No ingredients added yet.
            </div>
          ) : (
            recipe.ingredients.map((ri) => {
              const cost = (ri.ingredient.pricePerKg * (ri.amountGrams / 1000));
              return (
                <div key={ri.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-border shadow-sm group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-sm">
                      {ri.amountGrams}g
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{ri.ingredient.name}</p>
                      <p className="text-xs text-muted-foreground">€ {(ri.ingredient.pricePerKg / 100).toFixed(2)} / kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-mono font-medium text-foreground">€ {(cost / 100).toFixed(2)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMutation.mutate({ id: ri.id, recipeId: recipe.id })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function Recipes() {
  const { data: recipes, isLoading } = useRecipes();
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 flex overflow-hidden h-screen">
        {/* Left Panel: List */}
        <div className="w-full md:w-1/3 lg:w-96 border-r border-border bg-white flex flex-col z-20 shadow-xl shadow-black/5">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-2xl">Recipes</h2>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button size="icon" className="bg-primary text-white rounded-full shadow-lg shadow-primary/25 hover:bg-primary/90">
                    <Plus className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create New Recipe</DialogTitle></DialogHeader>
                  <CreateRecipeForm onClose={() => setIsCreating(false)} />
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-muted-foreground">Select a recipe to view details and food cost.</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {isLoading ? (
                 [1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
              ) : recipes?.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No recipes found.</div>
              ) : (
                recipes?.map(recipe => (
                  <div 
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md",
                      selectedRecipeId === recipe.id 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "bg-white border-transparent hover:border-border hover:bg-secondary/30"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className={cn("font-medium", selectedRecipeId === recipe.id ? "text-primary font-bold" : "text-foreground")}>
                        {recipe.name}
                      </h3>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", selectedRecipeId === recipe.id ? "text-primary translate-x-1" : "text-muted-foreground")} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{recipe.description || "No description"}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel: Details */}
        <div className="flex-1 bg-secondary/10 relative">
          {selectedRecipeId ? (
            <RecipeDetail id={selectedRecipeId} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                <ChefHat className="w-10 h-10 text-primary/50" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">Select a Recipe</h3>
              <p className="max-w-xs mx-auto">Click on a recipe from the list to view its ingredients and calculate food cost.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
