
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Filter, Package, ArrowUpDown, CheckCheck, Clock, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockOrders = [
  {
    id: "ORD-3491",
    customer: "John Smith",
    date: "2023-10-15",
    total: 129.99,
    status: "completed",
    items: 3,
    payment: "Credit Card",
    shippingMethod: "Express"
  },
  {
    id: "ORD-3490",
    customer: "Emily Johnson",
    date: "2023-10-15",
    total: 85.50,
    status: "processing",
    items: 2,
    payment: "PayPal",
    shippingMethod: "Standard"
  },
  {
    id: "ORD-3489",
    customer: "Michael Davis",
    date: "2023-10-14",
    total: 210.75,
    status: "completed",
    items: 4,
    payment: "Credit Card",
    shippingMethod: "Standard"
  },
  {
    id: "ORD-3488",
    customer: "Sarah Wilson",
    date: "2023-10-14",
    total: 42.99,
    status: "fraud-suspect",
    items: 1,
    payment: "Credit Card",
    shippingMethod: "Express"
  },
  {
    id: "ORD-3487",
    customer: "James Brown",
    date: "2023-10-13",
    total: 156.25,
    status: "completed",
    items: 3,
    payment: "PayPal",
    shippingMethod: "Standard"
  },
  {
    id: "ORD-3486",
    customer: "Jessica Miller",
    date: "2023-10-13",
    total: 99.99,
    status: "processing",
    items: 2,
    payment: "Credit Card",
    shippingMethod: "Express"
  },
  {
    id: "ORD-3485",
    customer: "David Garcia",
    date: "2023-10-12",
    total: 74.50,
    status: "completed",
    items: 1,
    payment: "Credit Card",
    shippingMethod: "Standard"
  },
  {
    id: "ORD-3484",
    customer: "Lisa Martinez",
    date: "2023-10-12",
    total: 199.99,
    status: "fraud-suspect",
    items: 5,
    payment: "PayPal",
    shippingMethod: "Express"
  }
];

type OrderStatus = "completed" | "processing" | "fraud-suspect" | "all";

const AdminOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");
  
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTab = activeTab === "all" || order.status === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <CheckCheck className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Processing
          </Badge>
        );
      case "fraud-suspect":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Fraud Alert
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Order Management - IntelliOrder Admin</title>
      </Helmet>
      
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage customer orders across your platform.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 90 days</DropdownMenuItem>
                  <DropdownMenuItem>Custom range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
              
              <Button variant="default" size="sm" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as OrderStatus)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="fraud-suspect">Fraud Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminOrdersPage;
