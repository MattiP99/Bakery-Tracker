import type { Express } from "express";
import { storage } from "../../storage";
import { api } from "@shared/routes";
import { parseId, sendValidationError } from "./utils";

export function registerInventoryRoutes(app: Express) {
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
      if (sendValidationError(res, err)) return;
      throw err;
    }
  });

  app.put(api.inventory.update.path, async (req, res) => {
    try {
      const input = api.inventory.update.input.parse(req.body);
      const item = await storage.updateInventoryItem(parseId(req.params.id), input);
      if (!item) return res.status(404).json({ message: "Inventory item not found" });
      res.json(item);
    } catch (err) {
      if (sendValidationError(res, err)) return;
      throw err;
    }
  });

  app.delete(api.inventory.delete.path, async (req, res) => {
    await storage.deleteInventoryItem(parseId(req.params.id));
    res.status(204).send();
  });
}
