import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  PackageOpen, 
  Search, 
  Filter, 
  ArrowDown, 
  ArrowUp, 
  Check, 
  AlertTriangle, 
  Truck,
  Download
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-9854",
    customerId: "CUST-1234",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 129.99 },
      { name: "Phone Charger", quantity: 2, price: 19.99 }
    ],
    total: 169.97,
    status: "pending",
    priority: "high",
    createdAt: "2023-08-12T10:30:00",
    deliveryOption: "express",
    shippingAddress: "123 Main St, New York, NY 10001"
  },
  {
    id: "ORD-9855",
    customerId: "CUST-5678",
    items: [
      { name: "Smart Watch Pro", quantity: 1, price: 299.99 },
      { name: "Watch Band", quantity: 1, price: 29.99 }
    ],
    total: 329.98,
    status: "pending",
    priority: "high",
    createdAt: "2023-08-12T11:45:00",
    deliveryOption: "standard",
    shippingAddress: "456 Park Ave, New York, NY 10002"
  },
  {
    id: "ORD-9856",
    customerId: "CUST-9012",
    items: [
      { name: "Bluetooth Speaker", quantity: 1, price: 79.99 },
      { name: "Power Bank", quantity: 1, price: 49.99 }
    ],
    total: 129.98,
    status: "pending",
    priority: "normal",
    createdAt: "2023-08-12T13:15:00",
    deliveryOption: "standard",
    shippingAddress: "789 Broadway, New York, NY 10003"
  },
  {
    id: "ORD-9857",
    customerId: "CUST-3456",
    items: [
      { name: "Laptop Sleeve", quantity: 1, price: 39.99 },
      { name: "Wireless Mouse", quantity: 1, price: 29.99 },
      { name: "HDMI Cable", quantity: 2, price: 14.99 }
    ],
    total: 99.96,
    status: "pending",
    priority: "normal",
    createdAt: "2023-08-12T14:30:00",
    deliveryOption: "standard",
    shippingAddress: "101 5th Ave, New York, NY 10004"
  },
  {
    id: "ORD-9858",
    customerId: "CUST-7890",
    items: [
      { name: "4K Monitor", quantity: 1, price: 349.99 },
      { name: "Monitor Stand", quantity: 1, price: 79.99 },
      { name: "Keyboard", quantity: 1, price: 89.99 }
    ],
    total: 519.97,
    status: "pending",
    priority: "high",
    createdAt: "2023-08-12T15:45:00",
    deliveryOption: "express",
    shippingAddress: "202 Wall St, New York, NY 10005"
  },
  {
    id: "ORD-9859",
    customerId: "CUST-2345",
    items: [
      { name: "Wireless Earbuds", quantity: 1, price: 159.99 },
      { name: "Phone Case", quantity: 1, price: 24.99 }
    ],
    total: 184.98,
    status: "pending",
    priority: "normal",
    createdAt: "2023-08-12T16:30:00",
    deliveryOption: "standard",
    shippingAddress: "303 Madison Ave, New York, NY 10006"
  },
  {
    id: "ORD-9860",
    customerId: "CUST-6789",
    items: [
      { name: "Gaming Mouse", quantity: 1, price: 69.99 },
      { name: "Mouse Pad", quantity: 1, price: 19.99 },
      { name: "Gaming Headset", quantity: 1, price: 99.99 }
    ],
    total: 189.97,
    status: "pending",
    priority: "normal",
    createdAt: "2023-08-12T17:15:00",
    deliveryOption: "standard",
    shippingAddress: "404 Lexington Ave, New York, NY 10007"
  },
];

// Convert USD to INR
const usdToInr = (usdAmount: number): number => {
  return usdAmount * 83.5; // Using an approximate conversion rate
};

// Format currency in rupees
const formatRupees = (amount: number): string => {
  return `₹${usdToInr(amount).toLocaleString('en-IN')}`;
};

// Order status definitions
const orderStatuses = {
  pending: { label: "Pending", color: "bg-amber-500" },
  processing: { label: "Processing", color: "bg-blue-500" },
  shipped: { label: "Shipped", color: "bg-green-500" },
  delivered: { label: "Delivered", color: "bg-accent" },
  cancelled: { label: "Cancelled", color: "bg-destructive" }
};

// Priority definitions
const priorities = {
  high: { label: "High Priority", color: "text-destructive" },
  normal: { label: "Normal", color: "text-muted-foreground" }
};

// Delivery option definitions
const deliveryOptions = {
  express: { label: "Express", icon: AlertTriangle, color: "text-destructive" },
  standard: { label: "Standard", icon: null, color: "text-muted-foreground" }
};

const WarehouseOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle sort changes
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // Filter and sort orders
  const filteredOrders = mockOrders
    .filter(order => {
      // Search filter
      const searchMatch = searchQuery === "" || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.customerId.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Priority filter
      const priorityMatch = filterPriority === null || order.priority === filterPriority;
      
      return searchMatch && priorityMatch;
    })
    .sort((a, b) => {
      if (sortBy === "createdAt") {
        return sortDirection === "asc" 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() 
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total;
      } else if (sortBy === "id") {
        return sortDirection === "asc" 
          ? a.id.localeCompare(b.id) 
          : b.id.localeCompare(a.id);
      }
      return 0;
    });

  // Handle order expansion/collapse
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Process an order
  const processOrder = (orderId: string) => {
    console.log(`Processing order ${orderId}`);
    toast({
      title: "Order processed",
      description: `Order ${orderId} has been marked for processing.`,
    });
    // In a real app, this would update the order status in the database
  };

  // Ship an order
  const shipOrder = (orderId: string) => {
    console.log(`Shipping order ${orderId}`);
    toast({
      title: "Order shipped",
      description: `Order ${orderId} has been marked for shipping.`,
    });
    // In a real app, this would update the order status and trigger shipping processes
  };

  // Export orders to CSV
  const exportOrders = () => {
    // Create CSV content
    const headers = ["Order ID", "Customer ID", "Total (₹)", "Status", "Priority", "Created At"];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customerId,
        usdToInr(order.total).toFixed(2),
        order.status,
        order.priority,
        order.createdAt
      ].join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: `${filteredOrders.length} orders exported to CSV.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Orders to Process - IntelliOrder</title>
      </Helmet>
      
      <DashboardLayout role="warehouse">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders to Process</h1>
            <p className="text-muted-foreground mt-1">
              View and manage pending orders that require processing.
            </p>
          </div>
          
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by order or customer ID"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="flex gap-2">
                <Button 
                  variant={filterPriority === "high" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterPriority(filterPriority === "high" ? null : "high")}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  High Priority
                </Button>
                <Button 
                  variant={filterPriority === "normal" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterPriority(filterPriority === "normal" ? null : "normal")}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Normal Priority
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportOrders}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          
          {/* Orders Summary */}
          <div className="glass-card rounded-xl p-6 space-y-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {filteredOrders.length} Orders{" "}
                {filterPriority ? `(${filterPriority} priority)` : ""}
              </h2>
              <div className="flex gap-3">
                <Button size="sm" onClick={() => {
                  toast({
                    title: "Batch processing",
                    description: "Processing all high priority orders...",
                  });
                }}>
                  Process All High Priority
                </Button>
              </div>
            </div>
            
            {/* Orders Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 rounded-t-lg text-sm font-medium text-muted-foreground">
              <div 
                className="col-span-2 flex items-center cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Order ID
                {sortBy === "id" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-3 w-3" /> : 
                    <ArrowDown className="ml-1 h-3 w-3" />
                )}
              </div>
              <div className="col-span-2">Customer</div>
              <div className="col-span-2">Items</div>
              <div 
                className="col-span-1 flex items-center cursor-pointer"
                onClick={() => handleSort("total")}
              >
                Total
                {sortBy === "total" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-3 w-3" /> : 
                    <ArrowDown className="ml-1 h-3 w-3" />
                )}
              </div>
              <div 
                className="col-span-2 flex items-center cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Date
                {sortBy === "createdAt" && (
                  sortDirection === "asc" ? 
                    <ArrowUp className="ml-1 h-3 w-3" /> : 
                    <ArrowDown className="ml-1 h-3 w-3" />
                )}
              </div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            
            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No orders found matching your search criteria.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="animate-fade-in opacity-0 transition-all duration-300"
                  >
                    {/* Order Row (collapsed view) */}
                    <div 
                      className={cn(
                        "grid grid-cols-12 gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer",
                        order.priority === "high" && "border-l-4 border-l-destructive"
                      )}
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      {/* Order ID */}
                      <div className="col-span-12 md:col-span-2 flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium",
                          orderStatuses[order.status as keyof typeof orderStatuses].color
                        )}>
                          #{order.id.slice(-2)}
                        </div>
                        <div>
                          <div className="font-medium">{order.id}</div>
                          <div className="md:hidden text-xs text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Customer */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="text-sm md:text-base">{order.customerId}</div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className={priorities[order.priority as keyof typeof priorities].color}>
                            {priorities[order.priority as keyof typeof priorities].label}
                          </span>
                          {order.deliveryOption === "express" && (
                            <span className="flex items-center text-destructive">
                              <AlertTriangle className="h-3 w-3 inline mr-1" />
                              Express
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Items Summary */}
                      <div className="col-span-6 md:col-span-2">
                        <div className="text-sm md:text-base">
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.items[0].name}{order.items.length > 1 ? `, +${order.items.length - 1} more` : ""}
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-6 md:col-span-1 font-medium">
                        {formatRupees(order.total)}
                      </div>
                      
                      {/* Date - Hidden on mobile, shown in expanded view */}
                      <div className="hidden md:block md:col-span-2 text-sm">
                        {formatDate(order.createdAt)}
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            shipOrder(order.id);
                          }}
                        >
                          <Truck className="h-4 w-4 mr-2" /> Ship
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            processOrder(order.id);
                          }}
                        >
                          <PackageOpen className="h-4 w-4 mr-2" /> Process
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Order Details */}
                    {expandedOrderId === order.id && (
                      <div className="mt-3 p-5 bg-muted/30 rounded-lg border border-border animate-fade-in opacity-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Order Details */}
                          <div>
                            <h3 className="text-sm font-semibold mb-3">Order Details</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant="outline" className={cn("bg-opacity-20", orderStatuses[order.status as keyof typeof orderStatuses].color)}>
                                  {orderStatuses[order.status as keyof typeof orderStatuses].label}
                                </Badge>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Priority:</span>
                                <span className={priorities[order.priority as keyof typeof priorities].color}>
                                  {priorities[order.priority as keyof typeof priorities].label}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery:</span>
                                <span className={deliveryOptions[order.deliveryOption as keyof typeof deliveryOptions].color}>
                                  {deliveryOptions[order.deliveryOption as keyof typeof deliveryOptions].label}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Date:</span>
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Shipping Details */}
                          <div>
                            <h3 className="text-sm font-semibold mb-3">Shipping Details</h3>
                            <div className="text-sm mb-2">
                              <div className="text-muted-foreground mb-1">Shipping Address:</div>
                              <div>{order.shippingAddress}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Items List */}
                        <div className="mt-6">
                          <h3 className="text-sm font-semibold mb-3">Items</h3>
                          <div className="bg-background rounded-lg border border-border overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground">
                              <div className="col-span-6">Product</div>
                              <div className="col-span-2 text-center">Quantity</div>
                              <div className="col-span-2 text-right">Price</div>
                              <div className="col-span-2 text-right">Total</div>
                            </div>
                            <div className="divide-y divide-border">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-4 p-3 text-sm">
                                  <div className="col-span-6">{item.name}</div>
                                  <div className="col-span-2 text-center">{item.quantity}</div>
                                  <div className="col-span-2 text-right">{formatRupees(item.price)}</div>
                                  <div className="col-span-2 text-right font-medium">
                                    {formatRupees(item.quantity * item.price)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="p-3 bg-muted/30 flex justify-end">
                              <div className="w-1/3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal:</span>
                                  <span>{formatRupees(order.total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Shipping:</span>
                                  <span>₹0</span>
                                </div>
                                <div className="flex justify-between font-medium mt-1 pt-1 border-t border-border">
                                  <span>Total:</span>
                                  <span>{formatRupees(order.total)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3">
                          <Button variant="outline" onClick={() => toggleOrderExpansion(order.id)}>
                            Close Details
                          </Button>
                          <Button variant="outline" onClick={() => shipOrder(order.id)}>
                            <Truck className="h-4 w-4 mr-2" /> Ship
                          </Button>
                          <Button onClick={() => processOrder(order.id)}>
                            <PackageOpen className="h-4 w-4 mr-2" /> Process
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default WarehouseOrdersPage;

