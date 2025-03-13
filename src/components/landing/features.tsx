
import React from "react";
import { ArrowRight, BarChart3, Box, CreditCard, Shield, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  delay: string;
  className?: string;
}

const FeatureCard = ({ title, description, icon: Icon, delay, className }: FeatureCardProps) => (
  <div 
    className={cn(
      "glass-card p-6 rounded-xl flex flex-col opacity-0",
      `animate-fade-in-up ${delay}`,
      className
    )}
  >
    <div className="h-12 w-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm flex-1">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful features for every role
          </h2>
          <p className="text-muted-foreground text-lg">
            IntelliOrder adapts to the specific needs of each department, creating a seamless workflow from order to delivery.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <FeatureCard
            title="Order Management"
            description="Process and track orders from placement to delivery with detailed status updates."
            icon={ShoppingCart}
            delay="animation-delay-100"
          />
          <FeatureCard
            title="Inventory Control"
            description="Real-time stock levels, alerts for low inventory, and automated reordering."
            icon={Box}
            delay="animation-delay-200"
          />
          <FeatureCard
            title="Fraud Detection"
            description="Advanced algorithms identify suspicious transactions before they process."
            icon={Shield}
            delay="animation-delay-300"
          />
          <FeatureCard
            title="Staff Management"
            description="Role-based access control ensures staff only see what they need to do their job."
            icon={Users}
            delay="animation-delay-400"
          />
          <FeatureCard
            title="Payment Processing"
            description="Secure, reliable payment processing with multiple payment method support."
            icon={CreditCard}
            delay="animation-delay-500"
          />
          <FeatureCard
            title="Analytics & Reporting"
            description="Comprehensive reports and analytics to drive better business decisions."
            icon={BarChart3}
            delay="animation-delay-600"
          />
        </div>
        
        <div className="text-center opacity-0 animate-fade-in animation-delay-700">
          <Button size="lg" asChild>
            <Link to="/register">
              Start Optimizing Your Operations <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default Features;
