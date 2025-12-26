import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Ingredients Routes
  app.get(api.ingredients.list.path, async (_req, res) => {
    const items = await storage.getIngredients();
    res.json(items);
  });

  app.get(api.ingredients.get.path, async (req, res) => {
    const item = await storage.getIngredient(Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(item);
  });

  app.post(api.ingredients.create.path, async (req, res) => {
    try {
      const input = api.ingredients.create.input.parse(req.body);
      const item = await storage.createIngredient(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.ingredients.update.path, async (req, res) => {
    try {
      const input = api.ingredients.update.input.parse(req.body);
      const item = await storage.updateIngredient(Number(req.params.id), input);
      if (!item) return res.status(404).json({ message: 'Ingredient not found' });
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.ingredients.delete.path, async (req, res) => {
    await storage.deleteIngredient(Number(req.params.id));
    res.status(204).send();
  });

  // Recipes Routes
  app.get(api.recipes.list.path, async (_req, res) => {
    const items = await storage.getRecipes();
    res.json(items);
  });

  app.get(api.recipes.get.path, async (req, res) => {
    const item = await storage.getRecipe(Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'Recipe not found' });
    res.json(item);
  });

  app.post(api.recipes.create.path, async (req, res) => {
    try {
      const input = api.recipes.create.input.parse(req.body);
      const item = await storage.createRecipe(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.recipes.update.path, async (req, res) => {
    try {
      const input = api.recipes.update.input.parse(req.body);
      const item = await storage.updateRecipe(Number(req.params.id), input);
      if (!item) return res.status(404).json({ message: 'Recipe not found' });
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.recipes.delete.path, async (req, res) => {
    await storage.deleteRecipe(Number(req.params.id));
    res.status(204).send();
  });

  // Recipe Ingredients Routes
  app.post(api.recipeIngredients.create.path, async (req, res) => {
    try {
      const input = api.recipeIngredients.create.input.parse(req.body);
      const item = await storage.addRecipeIngredient(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.recipeIngredients.delete.path, async (req, res) => {
    await storage.removeRecipeIngredient(Number(req.params.id));
    res.status(204).send();
  });

  // Inventory Routes
  app.get(api.inventory.list.path, async (_req, res) => {
    const items = await storage.getInventory();
    res.json(items);
  });

  app.post(api.inventory.create.path, async (req, res) => {
    try {
      const input = api.inventory.create.input.parse(req.body);
      const item = await storage.createInventoryItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.inventory.update.path, async (req, res) => {
    try {
      const input = api.inventory.update.input.parse(req.body);
      const item = await storage.updateInventoryItem(Number(req.params.id), input);
      if (!item) return res.status(404).json({ message: 'Inventory item not found' });
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.inventory.delete.path, async (req, res) => {
    await storage.deleteInventoryItem(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const ingredients = await storage.getIngredients();
  if (ingredients.length === 0) {
    const flour = await storage.createIngredient({ name: "Flour (Type 00)", pricePerKg: 120, stockAmount: 25000 }); // 1.20 euro/kg
    const sugar = await storage.createIngredient({ name: "Granulated Sugar", pricePerKg: 150, stockAmount: 10000 }); // 1.50 euro/kg
    const butter = await storage.createIngredient({ name: "Butter", pricePerKg: 800, stockAmount: 5000 }); // 8.00 euro/kg
    const eggs = await storage.createIngredient({ name: "Eggs", pricePerKg: 400, stockAmount: 2000 }); // 4.00 euro/kg (approx)
    const chocolate = await storage.createIngredient({ name: "Dark Chocolate 70%", pricePerKg: 1500, stockAmount: 3000 }); // 15.00 euro/kg
    
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
