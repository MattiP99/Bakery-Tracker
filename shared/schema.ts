import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

// Ingredients for Food Cost & Stock
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pricePerKg: integer("price_per_kg").notNull(), // In cents
  stockAmount: integer("stock_amount").default(0), // In grams
});

// Recipes for Desserts
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  yieldAmount: integer("yield_amount").default(1),
  servings: integer("servings").default(1), // Added for cost per serving
});

// Join table for Recipe Ingredients
export const recipeIngredients = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  amountGrams: integer("amount_grams").notNull(),
});

// General Inventory (Finished desserts, tools, separate components)
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'dessert', 'component', 'tool'
  location: text("location").notNull(), // 'fridge', 'freezer', 'shelf'
  quantity: integer("quantity").notNull().default(0),
  unit: text("unit").notNull().default('pcs'),
  servings: integer("servings").default(1), // Added for consistency if needed
});

// === RELATIONS ===

export const recipesRelations = relations(recipes, ({ many }) => ({
  ingredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
  ingredient: one(ingredients, {
    fields: [recipeIngredients.ingredientId],
    references: [ingredients.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertIngredientSchema = createInsertSchema(ingredients).omit({ id: true });
export const insertRecipeSchema = createInsertSchema(recipes).omit({ id: true });
export const insertRecipeIngredientSchema = createInsertSchema(recipeIngredients).omit({ id: true });
export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type InsertRecipeIngredient = z.infer<typeof insertRecipeIngredientSchema>;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

// Request types
export type CreateIngredientRequest = InsertIngredient;
export type UpdateIngredientRequest = Partial<InsertIngredient>;

export type CreateRecipeRequest = InsertRecipe;
export type UpdateRecipeRequest = Partial<InsertRecipe>;

export type CreateRecipeIngredientRequest = InsertRecipeIngredient;
export type UpdateRecipeIngredientRequest = Partial<InsertRecipeIngredient>;

export type CreateInventoryItemRequest = InsertInventoryItem;
export type UpdateInventoryItemRequest = Partial<InsertInventoryItem>;

// Response types including relations
export type RecipeWithIngredients = Recipe & {
  ingredients: (RecipeIngredient & { ingredient: Ingredient })[];
};
