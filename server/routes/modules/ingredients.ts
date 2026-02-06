import type { Express } from "express";
import { storage } from "../../storage";
import { api } from "@shared/routes";
import { parseId, sendValidationError } from "./utils";

export function registerIngredientRoutes(app: Express) {
  app.get(api.ingredients.list.path, async (_req, res) => {
    const items = await storage.getIngredients();
    res.json(items);
  });

  app.get(api.ingredients.get.path, async (req, res) => {
    const item = await storage.getIngredient(parseId(req.params.id));
    if (!item) return res.status(404).json({ message: "Ingredient not found" });
    res.json(item);
  });

  app.post(api.ingredients.create.path, async (req, res) => {
    try {
      const input = api.ingredients.create.input.parse(req.body);
      const item = await storage.createIngredient(input);
      res.status(201).json(item);
    } catch (err) {
      if (sendValidationError(res, err)) return;
      throw err;
    }
  });

  app.put(api.ingredients.update.path, async (req, res) => {
    try {
      const input = api.ingredients.update.input.parse(req.body);
      const item = await storage.updateIngredient(parseId(req.params.id), input);
      if (!item) return res.status(404).json({ message: "Ingredient not found" });
      res.json(item);
    } catch (err) {
      if (sendValidationError(res, err)) return;
      throw err;
    }
  });

  app.delete(api.ingredients.delete.path, async (req, res) => {
    await storage.deleteIngredient(parseId(req.params.id));
    res.status(204).send();
  });
}
