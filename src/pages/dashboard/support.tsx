
import React from "react";
import { Helmet } from "react-helmet";
import { CreditCard, MessageSquare, Search } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import WidgetGrid from "@/components/dashboard/widget-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SupportDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Support Dashboard - IntelliOrder</title>
      </Helmet>
      
      <DashboardLayout role="support">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage support requests, refunds, and customer inquiries.
            </p>
          </div>
          
          <WidgetGrid role="support" />
          
          <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-300">
            <h2 className="text-xl font-semibold mb-4">Order Lookup</h2>
            <div className="flex gap-2 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by order ID or customer email" className="pl-9" />
              </div>
              <Button>Search</Button>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No orders found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Enter an order ID or customer email to look up order details.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-400">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Pending Refunds</h2>
                <Button size="sm" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" /> Process All
                </Button>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                        R
                      </div>
                      <div>
                        <div className="font-medium">Refund #{i + 1}234</div>
                        <div className="text-sm text-muted-foreground">
                          Order #45{i}67 • ${(99.99 * (i + 1)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <Button size="sm">Approve</Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-500">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Messages</h2>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" /> View All
                </Button>
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div>
                        <div className="font-medium">Customer #{i + 1}</div>
                        <div className="text-sm text-muted-foreground">
                          {i === 0 ? "Where is my order?" : i === 1 ? "Item damaged on arrival" : "Request for refund"}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                        {i === 0 ? "New" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SupportDashboard;
