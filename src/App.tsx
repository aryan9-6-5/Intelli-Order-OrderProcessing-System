
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

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
import MessageView from "./pages/support/message-view";
import AuthRoute from "./components/auth/auth-route";
import { DashboardRole } from "./types";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check initial auth state
    const checkAuthState = async () => {
      await supabase.auth.getSession();
      setIsLoading(false);
    };
    
    checkAuthState();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
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
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard/admin" element={
              <AuthRoute requiredRole="admin">
                <AdminDashboard />
              </AuthRoute>
            } />
            <Route path="/dashboard/warehouse" element={
              <AuthRoute requiredRole="warehouse">
                <WarehouseDashboard />
              </AuthRoute>
            } />
            <Route path="/dashboard/support" element={
              <AuthRoute requiredRole="support">
                <SupportDashboard />
              </AuthRoute>
            } />
            
            {/* Protected admin routes */}
            <Route path="/admin/orders" element={
              <AuthRoute requiredRole="admin">
                <AdminOrdersPage />
              </AuthRoute>
            } />
            <Route path="/admin/inventory" element={
              <AuthRoute requiredRole="admin">
                <AdminInventoryPage />
              </AuthRoute>
            } />
            <Route path="/admin/reports" element={
              <AuthRoute requiredRole="admin">
                <AdminReportsPage />
              </AuthRoute>
            } />
            <Route path="/admin/fraud" element={
              <AuthRoute requiredRole="admin">
                <AdminFraudPage />
              </AuthRoute>
            } />
            <Route path="/admin/staff" element={
              <AuthRoute requiredRole="admin">
                <AdminStaffPage />
              </AuthRoute>
            } />
            <Route path="/admin/settings" element={
              <AuthRoute requiredRole="admin">
                <AdminSettingsPage />
              </AuthRoute>
            } />
            
            {/* Protected warehouse routes */}
            <Route path="/warehouse/orders" element={
              <AuthRoute requiredRole="warehouse">
                <WarehouseOrdersPage />
              </AuthRoute>
            } />
            <Route path="/warehouse/shipment" element={
              <AuthRoute requiredRole="warehouse">
                <WarehouseShipmentPage />
              </AuthRoute>
            } />
            <Route path="/warehouse/restock" element={
              <AuthRoute requiredRole="warehouse">
                <WarehouseRestockPage />
              </AuthRoute>
            } />
            
            {/* Protected support routes */}
            <Route path="/support/orders" element={
              <AuthRoute requiredRole="support">
                <SupportOrdersPage />
              </AuthRoute>
            } />
            <Route path="/support/refunds" element={
              <AuthRoute requiredRole="support">
                <SupportRefundsPage />
              </AuthRoute>
            } />
            <Route path="/support/fraud" element={
              <AuthRoute requiredRole="support">
                <SupportFraudPage />
              </AuthRoute>
            } />
            <Route path="/support/messages" element={
              <AuthRoute requiredRole="support">
                <SupportMessagesPage />
              </AuthRoute>
            } />
            <Route path="/support/messages/:id" element={
              <AuthRoute requiredRole="support">
                <MessageView />
              </AuthRoute>
            } />
            
            {/* Redirect /dashboard to role-specific dashboard */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Component to handle dashboard redirection based on user role
const DashboardRedirect = () => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        
        if (!session.session) {
          setRedirectTo('/login');
          return;
        }
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.session.user.id)
          .single();
        
        if (error || !profile) {
          console.error("Error fetching user profile:", error);
          setRedirectTo('/login');
          return;
        }
        
        setRedirectTo(`/dashboard/${profile.role}`);
      } catch (error) {
        console.error("Error in dashboard redirect:", error);
        setRedirectTo('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserRole();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <Navigate to={redirectTo || '/login'} replace />;
};

export default App;
