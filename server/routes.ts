import type { Express } from "express";
import type { Server } from "http";
import { registerIngredientRoutes } from "./routes/modules/ingredients";
import { registerRecipeRoutes, registerRecipeIngredientRoutes } from "./routes/modules/recipes";
import { registerInventoryRoutes } from "./routes/modules/inventory";
import { seedDatabaseIfEnabled } from "./routes/modules/seed";

/**
 * Main route registrar. Keeps server bootstrap simple and makes domain routes modular.
 */
export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  registerIngredientRoutes(app);
  registerRecipeRoutes(app);
  registerRecipeIngredientRoutes(app);
  registerInventoryRoutes(app);

  await seedDatabaseIfEnabled();

  return httpServer;
}
