
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Box, 
  CreditCard, 
  LogOut, 
  Menu, 
  MessageSquare, 
  PackageOpen, 
  Settings, 
  Shield, 
  ShoppingCart, 
  Truck, 
  User, 
  Users, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: SidebarItemProps) => (
  <Link 
    to={href} 
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
      active 
        ? "bg-accent text-accent-foreground" 
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    )}
    onClick={onClick}
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "warehouse" | "support";
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "Redirecting to login page...",
    });
    
    navigate("/login");
  };
  
  // Define navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { icon: BarChart3, label: "Dashboard", href: "/dashboard/admin" },
          { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
          { icon: Box, label: "Inventory", href: "/admin/inventory" },
          { icon: Shield, label: "Fraud Detection", href: "/admin/fraud" },
          { icon: Users, label: "Staff Management", href: "/admin/staff" },
          { icon: BarChart3, label: "Reports", href: "/admin/reports" },
          { icon: Settings, label: "Settings", href: "/admin/settings" },
        ];
      case "warehouse":
        return [
          { icon: BarChart3, label: "Dashboard", href: "/dashboard/warehouse" },
          { icon: PackageOpen, label: "Orders to Process", href: "/warehouse/orders" },
          { icon: Truck, label: "Shipment Tracking", href: "/warehouse/shipment" },
          { icon: Box, label: "Restock Requests", href: "/warehouse/restock" },
        ];
      case "support":
        return [
          { icon: BarChart3, label: "Dashboard", href: "/dashboard/support" },
          { icon: ShoppingCart, label: "Order Lookup", href: "/support/orders" },
          { icon: CreditCard, label: "Refund Processing", href: "/support/refunds" },
          { icon: Shield, label: "Fraud Cases", href: "/support/fraud" },
          { icon: MessageSquare, label: "Customer Messages", href: "/support/messages" },
        ];
    }
  };
  
  const navItems = getNavItems();
  
  // Get user data based on role
  const getUserData = () => {
    switch (role) {
      case "admin":
        return { name: "Admin User", email: "admin@intelliorder.com", avatar: "" };
      case "warehouse":
        return { name: "Warehouse Staff", email: "warehouse@intelliorder.com", avatar: "" };
      case "support":
        return { name: "Support Agent", email: "support@intelliorder.com", avatar: "" };
    }
  };
  
  const userData = getUserData();
  
  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transform transition-transform duration-300 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="text-accent">Intelli</span>
              <span>Order</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <SidebarItem 
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>
          
          <div className="mt-auto pt-4">
            <Separator className="mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={userData.avatar} />
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {userData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userData.name}</span>
                <span className="text-xs text-muted-foreground">{userData.email}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-lg border-b h-14 flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
