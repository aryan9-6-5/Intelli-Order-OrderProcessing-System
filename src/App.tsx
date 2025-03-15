
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
import WarehouseShipmentPage from "./pages/warehouse/shipment";
import WarehouseRestockPage from "./pages/warehouse/restock";

// Admin Pages
import AdminOrdersPage from "./pages/admin/orders";
import AdminInventoryPage from "./pages/admin/inventory";
import AdminReportsPage from "./pages/admin/reports";
import AdminFraudPage from "./pages/admin/fraud";
import AdminStaffPage from "./pages/admin/staff";
import AdminSettingsPage from "./pages/admin/settings";

// Support Pages
import SupportOrdersPage from "./pages/support/orders";
import SupportRefundsPage from "./pages/support/refunds";
import SupportFraudPage from "./pages/support/fraud";
import SupportMessagesPage from "./pages/support/messages";

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
          
          {/* Admin routes */}
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/fraud" element={<AdminFraudPage />} />
          <Route path="/admin/staff" element={<AdminStaffPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          
          {/* Warehouse routes */}
          <Route path="/warehouse/orders" element={<WarehouseOrdersPage />} />
          <Route path="/warehouse/shipment" element={<WarehouseShipmentPage />} />
          <Route path="/warehouse/restock" element={<WarehouseRestockPage />} />
          
          {/* Support routes */}
          <Route path="/support/orders" element={<SupportOrdersPage />} />
          <Route path="/support/refunds" element={<SupportRefundsPage />} />
          <Route path="/support/fraud" element={<SupportFraudPage />} />
          <Route path="/support/messages" element={<SupportMessagesPage />} />
          
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
