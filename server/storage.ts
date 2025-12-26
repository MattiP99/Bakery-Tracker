import { db } from "./db";
import {
  ingredients, recipes, recipeIngredients, inventoryItems,
  type Ingredient, type InsertIngredient, type UpdateIngredientRequest,
  type Recipe, type InsertRecipe, type UpdateRecipeRequest, type RecipeWithIngredients,
  type RecipeIngredient, type InsertRecipeIngredient,
  type InventoryItem, type InsertInventoryItem, type UpdateInventoryItemRequest
} from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // Ingredients
  getIngredients(): Promise<Ingredient[]>;
  getIngredient(id: number): Promise<Ingredient | undefined>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  updateIngredient(id: number, updates: UpdateIngredientRequest): Promise<Ingredient>;
  deleteIngredient(id: number): Promise<void>;

  // Recipes
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<RecipeWithIngredients | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, updates: UpdateRecipeRequest): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;

  // Recipe Ingredients
  addRecipeIngredient(ri: InsertRecipeIngredient): Promise<RecipeIngredient>;
  removeRecipeIngredient(id: number): Promise<void>;
  getRecipeIngredients(recipeId: number): Promise<RecipeIngredient[]>;

  // Inventory
  getInventory(): Promise<InventoryItem[]>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, updates: UpdateInventoryItemRequest): Promise<InventoryItem>;
  deleteInventoryItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Ingredients
  async getIngredients(): Promise<Ingredient[]> {
    return await db.select().from(ingredients).orderBy(asc(ingredients.name));
  }

  async getIngredient(id: number): Promise<Ingredient | undefined> {
    const [ingredient] = await db.select().from(ingredients).where(eq(ingredients.id, id));
    return ingredient;
  }

  async createIngredient(insertIngredient: InsertIngredient): Promise<Ingredient> {
    const [ingredient] = await db.insert(ingredients).values(insertIngredient).returning();
    return ingredient;
  }

  async updateIngredient(id: number, updates: UpdateIngredientRequest): Promise<Ingredient> {
    const [updated] = await db.update(ingredients).set(updates).where(eq(ingredients.id, id)).returning();
    return updated;
  }

  async deleteIngredient(id: number): Promise<void> {
    await db.delete(ingredients).where(eq(ingredients.id, id));
  }

  // Recipes
  async getRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes).orderBy(asc(recipes.name));
  }

  async getRecipe(id: number): Promise<RecipeWithIngredients | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    if (!recipe) return undefined;

    const ingredientsList = await db.query.recipeIngredients.findMany({
      where: eq(recipeIngredients.recipeId, id),
      with: {
        ingredient: true
      }
    });

    return { ...recipe, ingredients: ingredientsList };
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db.insert(recipes).values(insertRecipe).returning();
    return recipe;
  }

  async updateRecipe(id: number, updates: UpdateRecipeRequest): Promise<Recipe> {
    const [updated] = await db.update(recipes).set(updates).where(eq(recipes.id, id)).returning();
    return updated;
  }

  async deleteRecipe(id: number): Promise<void> {
    // Cascade delete recipe ingredients
    await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id));
    await db.delete(recipes).where(eq(recipes.id, id));
  }

  // Recipe Ingredients
  async addRecipeIngredient(ri: InsertRecipeIngredient): Promise<RecipeIngredient> {
    const [item] = await db.insert(recipeIngredients).values(ri).returning();
    return item;
  }

  async removeRecipeIngredient(id: number): Promise<void> {
    await db.delete(recipeIngredients).where(eq(recipeIngredients.id, id));
  }

  async getRecipeIngredients(recipeId: number): Promise<RecipeIngredient[]> {
    return await db.select().from(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));
  }

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(asc(inventoryItems.name));
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  async updateInventoryItem(id: number, updates: UpdateInventoryItemRequest): Promise<InventoryItem> {
    const [updated] = await db.update(inventoryItems).set(updates).where(eq(inventoryItems.id, id)).returning();
    return updated;
  }

  async deleteInventoryItem(id: number): Promise<void> {
    await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
  }
}

export const storage = new DatabaseStorage();
