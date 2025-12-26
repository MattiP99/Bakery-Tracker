import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Refrigerator, 
  ChefHat, 
  Scale, 
  UtensilsCrossed,
  Menu
} from "lucide-react";
import { useState } from "react";

// Using a placeholder for the logo as requested, styled elegantly
function Logo() {
  return (
    <div className="flex items-center gap-3 px-2 py-4">
      <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
         <UtensilsCrossed className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h1 className="font-display font-bold text-xl leading-none text-primary">Grapes</h1>
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">Santa Margherita</p>
      </div>
    </div>
  );
}

const navItems = [
  { label: "Inventory", href: "/inventory", icon: Refrigerator },
  { label: "Ingredients", href: "/ingredients", icon: Scale },
  { label: "Recipes & Costs", href: "/recipes", icon: ChefHat },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md border border-border"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <Logo />
          
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href || location.startsWith(`${item.href}/`);
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/25" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}>
                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-primary/70 group-hover:text-primary")} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <div className="p-4 bg-secondary/50 rounded-xl border border-secondary">
              <p className="text-xs text-muted-foreground text-center">
                Need help? <br />
                <span className="font-semibold text-primary cursor-pointer hover:underline">Contact Support</span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
