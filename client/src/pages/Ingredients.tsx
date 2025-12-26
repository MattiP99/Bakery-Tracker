import { useState } from "react";
import { useIngredients, useCreateIngredient, useUpdateIngredient, useDeleteIngredient } from "@/hooks/use-food-cost";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, Search, Scale, Coins, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertIngredientSchema } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = insertIngredientSchema.extend({
  pricePerKg: z.coerce.number().min(0, "Price must be positive"),
  stockAmount: z.coerce.number().min(0, "Stock cannot be negative"),
});

type IngredientFormValues = z.infer<typeof formSchema>;

function IngredientForm({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
  const createMutation = useCreateIngredient();
  const updateMutation = useUpdateIngredient();
  const isEditing = !!initialData;

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      pricePerKg: initialData?.pricePerKg || 0,
      stockAmount: initialData?.stockAmount || 0,
    },
  });

  function onSubmit(data: IngredientFormValues) {
    if (isEditing) {
      updateMutation.mutate({ id: initialData.id, ...data }, { onSuccess: onClose });
    } else {
      createMutation.mutate(data, { onSuccess: onClose });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredient Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Dark Chocolate 70%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pricePerKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (€) per Kg</FormLabel>
                <FormControl>
                  {/* API expects cents, UI shows Euros */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                    <Input 
                      type="number" 
                      step="0.01" 
                      className="pl-8"
                      value={field.value / 100}
                      onChange={e => field.onChange(Math.round(parseFloat(e.target.value) * 100))} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock (grams)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={isPending} className="bg-primary text-white hover:bg-primary/90">
            {isPending ? "Saving..." : (isEditing ? "Save Changes" : "Add Ingredient")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function Ingredients() {
  const { data: ingredients, isLoading } = useIngredients();
  const deleteMutation = useDeleteIngredient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredIngredients = ingredients?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
        <PageHeader 
          title="Ingredients & Costs" 
          description="Manage commodity prices to accurately calculate dessert costs."
          action={
            <Button onClick={handleCreate} className="bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Ingredient
            </Button>
          }
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editingItem ? "Edit Ingredient" : "New Ingredient"}
              </DialogTitle>
            </DialogHeader>
            <IngredientForm 
              onClose={() => setIsDialogOpen(false)} 
              initialData={editingItem}
            />
          </DialogContent>
        </Dialog>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <h3 className="text-2xl font-bold font-display">{ingredients?.length || 0}</h3>
              </div>
            </div>
          </div>
          {/* Add more stats if needed */}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search ingredients..." 
            className="pl-10 bg-white border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4">
               {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="font-semibold text-foreground pl-6">Name</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Price / Kg</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Stock (g)</TableHead>
                  <TableHead className="font-semibold text-foreground text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No ingredients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIngredients.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium pl-6">{item.name}</TableCell>
                      <TableCell className="text-right font-mono">
                        € {(item.pricePerKg / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {item.stockAmount} g
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mr-2 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if(confirm("Delete this ingredient? This might affect recipes.")) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  );
}
