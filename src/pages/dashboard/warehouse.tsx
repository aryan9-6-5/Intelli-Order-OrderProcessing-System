
import React from "react";
import { Helmet } from "react-helmet";
import { Truck, PackageOpen, Box, BarChart, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import WidgetGrid from "@/components/dashboard/widget-grid";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-accent/10 text-accent">
                  24 Orders Today
                </Badge>
                <Button size="sm">
                  Process All
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                      i < 2 ? "bg-destructive" : "bg-accent"
                    }`}>
                      #{98 + i}
                    </div>
                    <div>
                      <div className="font-medium">Order #98{i}54</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{3 + i} items</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                        <span>Priority: {i < 2 ? 
                          <span className="text-destructive font-medium">High</span> : 
                          "Normal"}
                        </span>
                        {i === 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                            <span className="flex items-center">
                              <AlertTriangle className="h-3 w-3 text-destructive mr-1" />
                              <span className="text-destructive font-medium">Express Delivery</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Truck className="h-4 w-4 mr-2" /> Ship
                    </Button>
                    <Button size="sm">
                      <PackageOpen className="h-4 w-4 mr-2" /> Process
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-400">
              <h2 className="text-xl font-semibold mb-4">Inventory Alerts</h2>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">
                        {i === 0 ? "Wireless Headphones" : i === 1 ? "Smart Watch Pro" : "Bluetooth Speaker"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        SKU: {i === 0 ? "WH-1234" : i === 1 ? "SW-5678" : "BS-9012"} • Stock: {i + 1} unit{i !== 0 ? "s" : ""} 
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress 
                        value={(i + 1) * 10} 
                        className="h-2" 
                        indicatorClassName={i === 0 ? "bg-destructive" : "bg-amber-500"}
                      />
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {(i + 1) * 10}% remaining
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button size="sm" variant="outline">
                        <Box className="h-4 w-4 mr-2" /> Restock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-500">
              <h2 className="text-xl font-semibold mb-4">Shipment Tracking</h2>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Tracking #{920 + i * 35}</div>
                      <Badge variant={
                        i === 0 ? "default" : i === 1 ? "secondary" : "outline"
                      }>
                        {i === 0 ? "In Transit" : i === 1 ? "Out for Delivery" : "Delivered"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Order #76{i}22 • {i === 0 ? "2" : i === 1 ? "4" : "3"} items • 
                      Destination: {i === 0 ? "New York, NY" : i === 1 ? "Los Angeles, CA" : "Chicago, IL"}
                    </div>
                    <div className="relative">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent"
                          style={{ width: `${i === 0 ? 40 : i === 1 ? 75 : 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Processing</span>
                        <span>Shipping</span>
                        <span>Out for Delivery</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6 animate-fade-in opacity-0 animation-delay-600">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Restock Requests</h2>
              <Button size="sm" variant="outline">
                <BarChart className="h-4 w-4 mr-2" /> View Report
              </Button>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {i === 0 ? "Smart Home Devices" : "Wireless Earbuds"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Request #REQ-{i === 0 ? "5678" : "9012"} • Quantity: {i === 0 ? "50" : "35"} units • Supplier: {i === 0 ? "TechVision Inc." : "SoundWave Electronics"}
                    </div>
                  </div>
                  <div>
                    <Badge variant={i === 0 ? "outline" : "secondary"} className="mb-2 block text-center">
                      {i === 0 ? "Pending Approval" : "Approved"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                      {i === 0 && (
                        <Button size="sm">
                          Approve
                        </Button>
                      )}
                    </div>
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
