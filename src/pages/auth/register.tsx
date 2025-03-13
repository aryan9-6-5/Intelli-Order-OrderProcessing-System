
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Container from "@/components/ui/container";
import AuthForm from "@/components/auth/auth-form";

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Create Account - IntelliOrder</title>
        <meta name="description" content="Create a new IntelliOrder account" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-muted/30">
        <div className="py-4 px-6 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-accent">Intelli</span>
            <span>Order</span>
          </Link>
        </div>
        
        <Container className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-md mx-auto">
            <AuthForm mode="register" className="animate-fade-in opacity-0" />
          </div>
        </Container>
      </div>
    </>
  );
};

export default Register;
