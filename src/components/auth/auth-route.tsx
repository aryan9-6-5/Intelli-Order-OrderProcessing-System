
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardRole } from "@/types";

interface AuthRouteProps {
  children: React.ReactNode;
  requiredRole?: DashboardRole;
}

const AuthRoute = ({ children, requiredRole }: AuthRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<DashboardRole | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          setIsAuthenticated(false);
          return;
        }
        
        // If role check is needed, get user profile
        if (requiredRole) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', sessionData.session.user.id)
            .single();
          
          if (error || !profile) {
            console.error("Error fetching user profile:", error);
            setIsAuthenticated(false);
            return;
          }
          
          setUserRole(profile.role as DashboardRole);
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [requiredRole]);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to user's dashboard if they have the wrong role
    return <Navigate to={`/dashboard/${userRole}`} replace />;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};

export default AuthRoute;
