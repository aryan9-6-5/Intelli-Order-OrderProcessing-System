
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DashboardRole } from "@/types";

interface AuthFormProps {
  mode: "login" | "register";
  className?: string;
}

// Demo credentials for testing
const DEMO_USERS = {
  "admin@intelliorder.com": { password: "admin123", role: "admin" as DashboardRole },
  "warehouse@intelliorder.com": { password: "warehouse123", role: "warehouse" as DashboardRole },
  "support@intelliorder.com": { password: "support123", role: "support" as DashboardRole },
};

const AuthForm = ({ mode, className }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<DashboardRole>("admin"); // Only used in register mode
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (mode === "login") {
        // Check if the provided credentials match our demo users
        const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
        
        if (demoUser && demoUser.password === password) {
          const userRole = demoUser.role;
          
          toast({
            title: "Logged in successfully",
            description: `Redirecting to ${userRole} dashboard...`,
          });
          
          navigate(`/dashboard/${userRole}`);
        } else {
          setLoginError("Invalid email or password");
        }
      } else {
        toast({
          title: "Account created successfully",
          description: "Please log in with your new credentials.",
        });
        
        navigate("/login");
      }
    }, 1500);
  };
  
  return (
    <div 
      className={cn(
        "w-full max-w-md mx-auto glass-card rounded-xl p-6 md:p-8",
        className
      )}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-1">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === "login" 
            ? "Sign in to your account to continue" 
            : "Enter your details to create your account"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {mode === "login" && (
              <a 
                href="#" 
                className="text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                Forgot password?
              </a>
            )}
          </div>
          <div className="relative">
            <Input 
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        
        {loginError && (
          <div className="text-sm font-medium text-destructive">{loginError}</div>
        )}
        
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={role === "admin" ? "default" : "outline"}
                className={
                  role === "admin" ? "" : "text-muted-foreground"
                }
                onClick={() => setRole("admin")}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant={role === "warehouse" ? "default" : "outline"}
                className={
                  role === "warehouse" ? "" : "text-muted-foreground"
                }
                onClick={() => setRole("warehouse")}
              >
                Warehouse
              </Button>
              <Button
                type="button"
                variant={role === "support" ? "default" : "outline"}
                className={
                  role === "support" ? "" : "text-muted-foreground"
                }
                onClick={() => setRole("support")}
              >
                Support
              </Button>
            </div>
          </div>
        )}
        
        {mode === "login" && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberMe}
              onCheckedChange={(checked) => 
                setRememberMe(checked as boolean)
              }
            />
            <Label 
              htmlFor="remember" 
              className="text-sm font-normal text-muted-foreground"
            >
              Remember me for 30 days
            </Label>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
              {mode === "login" ? "Signing in..." : "Creating account..."}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              {mode === "login" ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign in
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Create account
                </>
              )}
            </div>
          )}
        </Button>
        
        <div className="text-center text-sm mt-6">
          {mode === "login" ? (
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="font-medium text-accent hover:underline"
              >
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="font-medium text-accent hover:underline"
              >
                Sign in
              </a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
