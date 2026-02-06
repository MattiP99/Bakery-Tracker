import { storage } from "../../storage";

/**
 * Seed only when explicitly enabled.
 * This avoids side effects in production and makes backend behavior predictable.
 */
export async function seedDatabaseIfEnabled() {
  const shouldSeed = process.env.SEED_ON_BOOT === "true";
  if (!shouldSeed) return;

  const ingredients = await storage.getIngredients();
  if (ingredients.length === 0) {
    const flour = await storage.createIngredient({ name: "Flour (Type 00)", pricePerKg: 120, stockAmount: 25000 });
    const sugar = await storage.createIngredient({ name: "Granulated Sugar", pricePerKg: 150, stockAmount: 10000 });
    const butter = await storage.createIngredient({ name: "Butter", pricePerKg: 800, stockAmount: 5000 });
    const eggs = await storage.createIngredient({ name: "Eggs", pricePerKg: 400, stockAmount: 2000 });
    const chocolate = await storage.createIngredient({ name: "Dark Chocolate 70%", pricePerKg: 1500, stockAmount: 3000 });

    const croissant = await storage.createRecipe({ name: "Butter Croissant", description: "Classic French butter croissant", yieldAmount: 12 });
    await storage.addRecipeIngredient({ recipeId: croissant.id, ingredientId: flour.id, amountGrams: 500 });
    await storage.addRecipeIngredient({ recipeId: croissant.id, ingredientId: sugar.id, amountGrams: 60 });
    await storage.addRecipeIngredient({ recipeId: croissant.id, ingredientId: butter.id, amountGrams: 250 });

    const cake = await storage.createRecipe({ name: "Chocolate Cake", description: "Rich dark chocolate cake", yieldAmount: 8 });
    await storage.addRecipeIngredient({ recipeId: cake.id, ingredientId: flour.id, amountGrams: 200 });
    await storage.addRecipeIngredient({ recipeId: cake.id, ingredientId: sugar.id, amountGrams: 300 });
    await storage.addRecipeIngredient({ recipeId: cake.id, ingredientId: butter.id, amountGrams: 100 });
    await storage.addRecipeIngredient({ recipeId: cake.id, ingredientId: chocolate.id, amountGrams: 200 });
    await storage.addRecipeIngredient({ recipeId: cake.id, ingredientId: eggs.id, amountGrams: 150 });
  }

  const inventory = await storage.getInventory();
  if (inventory.length === 0) {
    await storage.createInventoryItem({ name: "Croissants (Frozen)", category: "dessert", location: "freezer", quantity: 50, unit: "pcs" });
    await storage.createInventoryItem({ name: "Macarons (Assorted)", category: "dessert", location: "fridge", quantity: 100, unit: "pcs" });
    await storage.createInventoryItem({ name: "Whisk", category: "tool", location: "shelf", quantity: 5, unit: "pcs" });
    await storage.createInventoryItem({ name: "Rolling Pin", category: "tool", location: "shelf", quantity: 3, unit: "pcs" });
    await storage.createInventoryItem({ name: "Silicone Mats", category: "tool", location: "shelf", quantity: 10, unit: "pcs" });
  }
}
