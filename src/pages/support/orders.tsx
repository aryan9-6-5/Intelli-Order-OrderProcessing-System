
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Filter, Download, FileText, Package, Clock, MapPin, Calendar } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const orderStatuses = ["all", "processing", "shipped", "delivered", "cancelled", "returned"];

const mockOrders = [
  {
    id: "ORD-12345",
    customer: "John Smith",
    email: "john.smith@example.com",
    date: "2023-04-12",
    total: "$129.99",
    status: "processing",
    items: 3,
    shippingAddress: "123 Main St, Anytown, CA 94321",
  },
  {
    id: "ORD-12346",
    customer: "Emma Johnson",
    email: "emma.j@example.com",
    date: "2023-04-10",
    total: "$75.50",
    status: "shipped",
    items: 2,
    shippingAddress: "456 Oak Ave, Big City, NY 10001",
  },
  {
    id: "ORD-12347",
    customer: "Michael Brown",
    email: "m.brown@example.com",
    date: "2023-04-08",
    total: "$210.00",
    status: "delivered",
    items: 4,
    shippingAddress: "789 Pine St, Smallville, TX 75001",
  },
  {
    id: "ORD-12348",
    customer: "Sophia Garcia",
    email: "s.garcia@example.com",
    date: "2023-04-05",
    total: "$42.99",
    status: "cancelled",
    items: 1,
    shippingAddress: "321 Elm Rd, Westville, IL 60001",
  },
  {
    id: "ORD-12349",
    customer: "Robert Wilson",
    email: "r.wilson@example.com",
    date: "2023-04-01",
    total: "$156.75",
    status: "returned",
    items: 2,
    shippingAddress: "654 Cedar Ln, Eastburg, FL 33010",
  }
];

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusStyles = {
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-purple-100 text-purple-800"
  };
  
  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const SupportOrdersPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(mockOrders[0]);
  
  const filteredOrders = mockOrders.filter(order => 
    (currentTab === "all" || order.status === currentTab) &&
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Helmet>
        <title>Order Lookup - IntelliOrder Support</title>
      </Helmet>
      
      <DashboardLayout role="support">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Lookup</h1>
            <p className="text-muted-foreground mt-1">
              Search and manage customer orders
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by order ID, customer name, or email" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-auto">
              {orderStatuses.map(status => (
                <TabsTrigger key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {orderStatuses.map(status => (
              <TabsContent key={status} value={status} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">Orders {status !== "all" ? `(${status})` : ""}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-1">
                          {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                              <div 
                                key={order.id}
                                className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedOrder.id === order.id ? 'bg-muted' : ''}`}
                                onClick={() => setSelectedOrder(order)}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{order.id}</div>
                                    <div className="text-sm text-muted-foreground">{order.customer}</div>
                                  </div>
                                  <OrderStatusBadge status={order.status} />
                                </div>
                                <div className="flex justify-between mt-1 text-sm">
                                  <div>{order.date}</div>
                                  <div className="font-medium">{order.total}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-6 text-center">
                              <p className="text-muted-foreground">No orders found.</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Card className="h-full">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Order Details</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex items-center gap-2" onClick={() => {
                            toast({
                              title: "Invoice generated",
                              description: "Order invoice has been generated successfully."
                            });
                          }}>
                            <FileText className="h-4 w-4" />
                            Invoice
                          </Button>
                          <Button size="sm" className="flex items-center gap-2" onClick={() => {
                            toast({
                              title: "Processing refund",
                              description: `Initiated refund process for order ${selectedOrder.id}.`
                            });
                          }}>
                            Refund
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{selectedOrder.id}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Calendar className="h-4 w-4" />
                                <span>Ordered on {selectedOrder.date}</span>
                              </div>
                            </div>
                            <OrderStatusBadge status={selectedOrder.status} />
                          </div>
                          
                          <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Order Summary
                              </h4>
                              <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Customer:</span>
                                  <span className="font-medium">{selectedOrder.customer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email:</span>
                                  <span>{selectedOrder.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Items:</span>
                                  <span>{selectedOrder.items} items</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Total:</span>
                                  <span className="font-bold">{selectedOrder.total}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <h4 className="font-medium flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Shipping Details
                              </h4>
                              <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                                <div>
                                  <span className="text-muted-foreground">Address:</span>
                                  <p className="mt-1">{selectedOrder.shippingAddress}</p>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  <span className="font-medium">
                                    {selectedOrder.status === "processing" && "Preparing to ship"}
                                    {selectedOrder.status === "shipped" && "In transit"}
                                    {selectedOrder.status === "delivered" && "Delivered on April 15, 2023"}
                                    {selectedOrder.status === "cancelled" && "Cancelled on April 6, 2023"}
                                    {selectedOrder.status === "returned" && "Returned on April 10, 2023"}
                                  </span>
                                </div>
                                {selectedOrder.status === "shipped" && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Estimated delivery:</span>
                                    <span>April 15, 2023</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Order Timeline
                            </h4>
                            <div className="bg-muted/40 p-4 rounded-lg space-y-4">
                              {[
                                { date: "April 12, 2023", time: "9:30 AM", event: "Order placed", description: "Order #" + selectedOrder.id + " was placed" },
                                { date: "April 12, 2023", time: "11:45 AM", event: "Payment confirmed", description: "Payment of " + selectedOrder.total + " was confirmed" },
                                { date: "April 13, 2023", time: "2:15 PM", event: "Processing", description: "Order is being prepared for shipping" },
                                ...(selectedOrder.status !== "processing" ? [{ date: "April 14, 2023", time: "10:00 AM", event: "Shipped", description: "Order was shipped via Express Delivery" }] : []),
                                ...(selectedOrder.status === "delivered" ? [{ date: "April 15, 2023", time: "3:30 PM", event: "Delivered", description: "Package was delivered" }] : []),
                                ...(selectedOrder.status === "cancelled" ? [{ date: "April 6, 2023", time: "5:45 PM", event: "Cancelled", description: "Order was cancelled by customer" }] : []),
                                ...(selectedOrder.status === "returned" ? [
                                  { date: "April 15, 2023", time: "3:30 PM", event: "Delivered", description: "Package was delivered" },
                                  { date: "April 8, 2023", time: "1:15 PM", event: "Return requested", description: "Customer requested to return items" },
                                  { date: "April 10, 2023", time: "11:30 AM", event: "Return completed", description: "Return was processed and refund issued" }
                                ] : [])
                              ].map((event, index) => (
                                <div key={index} className="flex">
                                  <div className="mr-4 flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    {index < 
                                      (selectedOrder.status === "processing" ? 3 :
                                       selectedOrder.status === "shipped" ? 4 :
                                       selectedOrder.status === "delivered" ? 5 :
                                       selectedOrder.status === "cancelled" ? 4 :
                                       selectedOrder.status === "returned" ? 7 : 0) - 1 && (
                                      <div className="w-0.5 h-full bg-border" />
                                    )}
                                  </div>
                                  <div className="pb-5">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{event.event}</span>
                                      <span className="text-sm text-muted-foreground">
                                        {event.date} at {event.time}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SupportOrdersPage;
