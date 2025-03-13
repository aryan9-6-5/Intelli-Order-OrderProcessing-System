
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight inline-flex items-center gap-2 transition-all"
          >
            <span className="text-accent">Intelli</span>
            <span>Order</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className={cn(
                  "font-medium transition-colors hover:text-accent",
                  location.pathname === "/" && "text-accent"
                )}
              >
                Home
              </Link>
              <a
                href="#features"
                className="font-medium transition-colors hover:text-accent"
              >
                Features
              </a>
              <a
                href="#about"
                className="font-medium transition-colors hover:text-accent"
              >
                About
              </a>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground p-2 rounded-md hover:bg-accent/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </Container>
      
      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-background transition-transform duration-300 pt-20",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Container className="flex flex-col space-y-6 py-6">
          <Link
            to="/"
            className={cn(
              "py-3 text-xl font-medium border-b border-border",
              location.pathname === "/" && "text-accent"
            )}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <a
            href="#features"
            className="py-3 text-xl font-medium border-b border-border"
            onClick={() => setIsOpen(false)}
          >
            Features
          </a>
          <a
            href="#about"
            className="py-3 text-xl font-medium border-b border-border"
            onClick={() => setIsOpen(false)}
          >
            About
          </a>
          
          <div className="flex flex-col space-y-3 pt-4">
            <Button variant="outline" asChild className="w-full">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Navbar;
