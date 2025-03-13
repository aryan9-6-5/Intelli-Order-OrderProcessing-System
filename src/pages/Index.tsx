
import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>IntelliOrder - E-commerce Operations Management</title>
        <meta name="description" content="A role-based e-commerce operations platform for seamless inventory management, fraud detection, and order processing." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
        </main>
        
        <footer className="py-8 px-4 border-t">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} IntelliOrder. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
