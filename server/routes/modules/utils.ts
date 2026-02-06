import { z } from "zod";
import type { Response } from "express";

export function parseId(value: string): number {
  return Number(value);
}

export function sendValidationError(res: Response, err: unknown): boolean {
  if (err instanceof z.ZodError) {
    const issue = err.errors[0];
    res.status(400).json({
      message: issue?.message || "Validation error",
      field: issue?.path?.join("."),
    });
    return true;
  }

  return false;
}
