
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-2/3 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="space-y-5">
              <div className="inline-block animate-fade-in opacity-0">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-accent/10 text-accent">
                  Streamline your e-commerce operations
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight opacity-0 animate-fade-in animation-delay-100">
                <span className="block">Intelligent order</span>
                <span className="block text-accent">management system</span>
              </h1>
              
              <p className="text-lg text-muted-foreground opacity-0 animate-fade-in animation-delay-200 text-balance">
                A role-based e-commerce operations platform for seamless inventory management, fraud detection, and order processing.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start opacity-0 animate-fade-in animation-delay-300">
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
            
            <div className="pt-4 grid grid-cols-3 gap-4 opacity-0 animate-fade-in animation-delay-400">
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl md:text-3xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl md:text-3xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <div className="text-2xl md:text-3xl font-bold">+150k</div>
                <div className="text-sm text-muted-foreground">Orders processed</div>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square max-w-xl mx-auto lg:mx-0 opacity-0 animate-fade-in animation-delay-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl" />
            <div className="relative w-full h-full glass-card rounded-3xl p-8 flex items-center justify-center overflow-hidden">
              <div className="w-full max-w-md aspect-video bg-white dark:bg-black/60 rounded-xl shadow-xl flex flex-col">
                <div className="h-8 bg-secondary flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/70" />
                    <div className="w-3 h-3 rounded-full bg-accent/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="h-5 w-32 bg-secondary/70 rounded-md mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-secondary/60 rounded-md" />
                    <div className="h-4 w-3/4 bg-secondary/60 rounded-md" />
                    <div className="h-4 w-5/6 bg-secondary/60 rounded-md" />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="h-8 w-24 bg-accent/80 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
