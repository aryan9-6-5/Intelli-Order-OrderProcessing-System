
import React from "react";
import { Helmet } from "react-helmet";
import { Truck } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import WidgetGrid from "@/components/dashboard/widget-grid";
import { Button } from "@/components/ui/button";

const WarehouseDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Warehouse Dashboard - IntelliOrder</title>
      </Helmet>
      
      <DashboardLayout role="warehouse">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Warehouse Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage orders, shipments, and inventory.
            </p>
          </div>
          
          <WidgetGrid role="warehouse" />
          
          <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Orders Pending Fulfillment</h2>
              <Button size="sm">
                Process All
              </Button>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                      #{i + 1}
                    </div>
                    <div>
                      <div className="font-medium">Order #98{i}54</div>
                      <div className="text-sm text-muted-foreground">
                        {3 + i} items • Priority: {i < 2 ? "High" : "Normal"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-2" /> Ship
                    </Button>
                    <Button size="sm">Process</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-400">
            <h2 className="text-xl font-semibold mb-4">Inventory Alerts</h2>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">Product SKU-1234-{i}</div>
                    <div className="text-sm text-muted-foreground">
                      Current stock: {i + 1} unit{i !== 0 ? "s" : ""} 
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-destructive"
                        style={{ width: `${(i + 1) * 10}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {(i + 1) * 10}% remaining
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button size="sm" variant="outline">
                      Restock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default WarehouseDashboard;
