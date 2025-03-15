
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Determine if this might be a dashboard route
  const isDashboardRoute = location.pathname.includes('/dashboard') || 
                           location.pathname.includes('/admin') ||
                           location.pathname.includes('/warehouse') ||
                           location.pathname.includes('/support');

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center max-w-md p-6 glass-card rounded-xl">
        <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          {isDashboardRoute && (
            <Button asChild>
              <Link to="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
