
import React from "react";
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/layout/dashboard-layout";
import WidgetGrid from "@/components/dashboard/widget-grid";

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard - IntelliOrder</title>
      </Helmet>
      
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your store's operations.
            </p>
          </div>
          
          <WidgetGrid role="admin" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-400">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                        #{i + 1}
                      </div>
                      <div>
                        <div className="font-medium">Order #34{i}98</div>
                        <div className="text-sm text-muted-foreground">
                          2 items • ${(149.99 * (i + 1)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-500">
              <h2 className="text-xl font-semibold mb-4">Fraud Alert Activity</h2>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-medium">
                        !
                      </div>
                      <div>
                        <div className="font-medium">Suspicious Transaction</div>
                        <div className="text-sm text-muted-foreground">
                          Order #23{i}{i}5 • ${(299.99 * (i + 1)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                        Review
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

export default AdminDashboard;
