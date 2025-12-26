import { Sidebar } from "@/components/layout/Sidebar";
import { Link } from "wouter";
import { ArrowRight, Refrigerator, ChefHat, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex font-sans">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-8 flex flex-col justify-center max-w-5xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Bakery Management System</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Manage your <span className="text-primary">kitchen</span> <br /> with precision.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-12 leading-relaxed">
            Welcome to the Grapes Santa Margherita management dashboard. 
            Track inventory, calculate food costs, and manage recipes all in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/inventory" className="group">
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <Refrigerator className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Inventory</h3>
                <p className="text-muted-foreground mb-8 flex-1">Track items in fridge, freezer, and dry storage.</p>
                <div className="flex items-center text-primary font-medium text-sm">
                  View Stock <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/recipes" className="group">
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Recipes</h3>
                <p className="text-muted-foreground mb-8 flex-1">Manage recipes and calculate precise food costs.</p>
                <div className="flex items-center text-primary font-medium text-sm">
                  Manage Recipes <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/ingredients" className="group">
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Costs</h3>
                <p className="text-muted-foreground mb-8 flex-1">Update ingredient prices and monitor expenses.</p>
                <div className="flex items-center text-primary font-medium text-sm">
                  Update Prices <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
