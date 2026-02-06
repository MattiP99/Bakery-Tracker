import type { Express } from "express";
import { storage } from "../../storage";
import { api } from "@shared/routes";
import { parseId, sendValidationError } from "./utils";

export function registerRecipeRoutes(app: Express) {
  app.get(api.recipes.list.path, async (_req, res) => {
    const items = await storage.getRecipes();
    res.json(items);
  });

  app.get(api.recipes.get.path, async (req, res) => {
    const item = await storage.getRecipe(parseId(req.params.id));
    if (!item) return res.status(404).json({ message: "Recipe not found" });
    res.json(item);
  });

  app.post(api.recipes.create.path, async (req, res) => {
    try {
      const input = api.recipes.create.input.parse(req.body);
      const item = await storage.createRecipe(input);
      res.status(201).json(item);
    } catch (err) {
      if (sendValidationError(res, err)) return;
      throw err;
    }
  });

  app.put(api.recipes.update.path, async (req, res) => {
    try {
      const input = api.recipes.update.input.parse(req.body);
      const item = await storage.updateRecipe(parseId(req.params.id), input);
      if (!item) return res.status(404).json({ message: "Recipe not found" });
      res.json(item);
    } catch (err) {
      if (sendValidationError(res, err)) return;
      throw err;
    }
  });

  app.delete(api.recipes.delete.path, async (req, res) => {
    await storage.deleteRecipe(parseId(req.params.id));
    res.status(204).send();
  });
}

export function registerRecipeIngredientRoutes(app: Express) {
  app.post(api.recipeIngredients.create.path, async (req, res) => {
    try {
      const input = api.recipeIngredients.create.input.parse(req.body);
      const item = await storage.addRecipeIngredient(input);
      res.status(201).json(item);
    } catch (err) {
      if (sendValidationError(res, err)) return;
      throw err;
    }
  });

  app.delete(api.recipeIngredients.delete.path, async (req, res) => {
    await storage.removeRecipeIngredient(parseId(req.params.id));
    res.status(204).send();
  });
}
