import { useState } from "react";
import { useInventory, useCreateInventoryItem, useDeleteInventoryItem, useUpdateInventoryItem } from "@/hooks/use-inventory";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/ui/PageHeader";
import { Plus, Trash2, Search, Refrigerator, Snowflake, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertInventoryItemSchema } from "@shared/schema";

const formSchema = insertInventoryItemSchema.extend({
  quantity: z.coerce.number(),
});

function InventoryItemForm({ onClose }) {
  const createMutation = useCreateInventoryItem();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "component",
      location: "fridge",
      quantity: 1,
      unit: "pcs",
    },
  });

  function onSubmit(data) {
    createMutation.mutate(data, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Puff Pastry Sheets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dessert">Finished Dessert</SelectItem>
                    <SelectItem value="component">Component</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fridge">Fridge</SelectItem>
                    <SelectItem value="freezer">Freezer</SelectItem>
                    <SelectItem value="shelf">Shelf / Storage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="pcs, kg, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending} className="bg-primary text-white hover:bg-primary/90">
            {createMutation.isPending ? "Adding..." : "Add Item"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function Inventory() {
  const { data: items, isLoading } = useInventory();
  const deleteMutation = useDeleteInventoryItem();
  const updateMutation = useUpdateInventoryItem();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter items based on search
  const filteredItems = items?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Group by location
  const fridgeItems = filteredItems.filter(i => i.location === "fridge");
  const freezerItems = filteredItems.filter(i => i.location === "freezer");
  const toolItems = filteredItems.filter(i => i.category === "tool" || i.location === "shelf"); // Assume shelf is mostly tools or dry goods

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const InventoryList = ({ items, icon: Icon }) => (
    items.length === 0 ? (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-border">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No items found</h3>
        <p className="text-muted-foreground">Add new items to track your stock.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group bg-white p-5 rounded-2xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${
                item.category === 'dessert' ? 'bg-purple-50 text-purple-600' :
                item.category === 'tool' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {item.category === 'dessert' && <Snowflake className="w-4 h-4" />}
                {item.category === 'tool' && <Wrench className="w-4 h-4" />}
                {item.category === 'component' && <Refrigerator className="w-4 h-4" />}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive transition-all"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this item?")) {
                    deleteMutation.mutate(item.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <h3 className="font-bold text-lg text-foreground mb-1">{item.name}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">{item.category}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border-border"
                  onClick={() => updateMutation.mutate({ id: item.id, quantity: Math.max(0, item.quantity - 1) })}
                >
                  -
                </Button>
                <span className="font-mono font-medium text-lg w-8 text-center">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border-border bg-secondary/50"
                  onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                >
                  +
                </Button>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-y-auto">
        <PageHeader 
          title="Inventory Management" 
          description="Track your stock across fridge, freezer, and tool storage."
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Add Inventory Item</DialogTitle>
                </DialogHeader>
                <InventoryItemForm onClose={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search items..." 
            className="pl-10 bg-white border-border focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="fridge" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-xl border border-border shadow-sm inline-flex">
            <TabsTrigger 
              value="fridge" 
              className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              Fridge
            </TabsTrigger>
            <TabsTrigger 
              value="freezer" 
              className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              Freezer
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="rounded-lg px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
            >
              Tools & Dry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fridge" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InventoryList items={fridgeItems} icon={Refrigerator} />
          </TabsContent>
          
          <TabsContent value="freezer" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InventoryList items={freezerItems} icon={Snowflake} />
          </TabsContent>
          
          <TabsContent value="tools" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InventoryList items={toolItems} icon={Wrench} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
