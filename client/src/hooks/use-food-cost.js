import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  api, 
  buildUrl, 
  } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === INGREDIENTS ===

export function useIngredients() {
  return useQuery({
    queryKey: [api.ingredients.list.path],
    queryFn: async () => {
      const res = await fetch(api.ingredients.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch ingredients");
      return api.ingredients.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateIngredient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.ingredients.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create ingredient");
      return api.ingredients.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ingredients.list.path] });
      toast({ title: "Success", description: "Ingredient created" });
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const url = buildUrl(api.ingredients.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update ingredient");
      return api.ingredients.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ingredients.list.path] });
      toast({ title: "Success", description: "Ingredient updated" });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      const url = buildUrl(api.ingredients.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete ingredient");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ingredients.list.path] });
      toast({ title: "Deleted", description: "Ingredient removed" });
    },
  });
}

// === RECIPES ===

export function useRecipes() {
  return useQuery({
    queryKey: [api.recipes.list.path],
    queryFn: async () => {
      const res = await fetch(api.recipes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return api.recipes.list.responses[200].parse(await res.json());
    },
  });
}

export function useRecipe(id) {
  return useQuery({
    queryKey: [api.recipes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.recipes.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch recipe");
      return api.recipes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.recipes.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create recipe");
      return api.recipes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
      toast({ title: "Success", description: "Recipe created" });
    },
  });
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id) => {
      const url = buildUrl(api.recipes.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete recipe");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
      toast({ title: "Deleted", description: "Recipe removed" });
    },
  });
}

// === RECIPE INGREDIENTS ===

export function useAddRecipeIngredient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.recipeIngredients.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add ingredient to recipe");
      return api.recipeIngredients.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific recipe query to refresh the list
      queryClient.invalidateQueries({ queryKey: [api.recipes.get.path, variables.recipeId] });
      toast({ title: "Success", description: "Ingredient added" });
    },
  });
}

export function useRemoveRecipeIngredient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, recipeId }) => {
      const url = buildUrl(api.recipeIngredients.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to remove ingredient");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.get.path, variables.recipeId] });
      toast({ title: "Removed", description: "Ingredient removed from recipe" });
    },
  });
}
