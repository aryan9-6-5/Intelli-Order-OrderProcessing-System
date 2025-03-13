
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import AdminDashboard from "./pages/dashboard/admin";
import WarehouseDashboard from "./pages/dashboard/warehouse";
import SupportDashboard from "./pages/dashboard/support";
import WarehouseOrdersPage from "./pages/warehouse/orders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Dashboard routes - would be protected in a real application */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/warehouse" element={<WarehouseDashboard />} />
          <Route path="/dashboard/support" element={<SupportDashboard />} />
          
          {/* Warehouse routes */}
          <Route path="/warehouse/orders" element={<WarehouseOrdersPage />} />
          
          {/* Redirect /dashboard to the appropriate dashboard based on role */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/admin" replace />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
