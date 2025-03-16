import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Filter, Plus, ArrowUpDown, AlertTriangle, BarChart, Package } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ForecastChart from "@/components/inventory/forecast-chart";
import RestockRecommendation from "@/components/inventory/restock-recommendation";

const mockProducts = [
  {
    id: "PRD-1001",
    name: "Premium Bluetooth Headphones",
    category: "Electronics",
    price: 149.99,
    stock: 24,
    status: "in-stock",
    sku: "ELEC-BH-001",
  },
  {
    id: "PRD-1002",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    price: 249.99,
    stock: 8,
    status: "low-stock",
    sku: "FURN-OC-002",
  },
  {
    id: "PRD-1003",
    name: "Stainless Steel Water Bottle",
    category: "Accessories",
    price: 29.99,
    stock: 0,
    status: "out-of-stock",
    sku: "ACC-WB-003",
  },
  {
    id: "PRD-1004",
    name: "Wireless Gaming Mouse",
    category: "Electronics",
    price: 79.99,
    stock: 15,
    status: "in-stock",
    sku: "ELEC-GM-004",
  },
  {
    id: "PRD-1005",
    name: "Laptop Carrying Case",
    category: "Accessories",
    price: 45.99,
    stock: 6,
    status: "low-stock",
    sku: "ACC-LC-005",
  },
  {
    id: "PRD-1006",
    name: "Ultra HD Monitor 27-inch",
    category: "Electronics",
    price: 299.99,
    stock: 12,
    status: "in-stock",
    sku: "ELEC-MON-006",
  },
  {
    id: "PRD-1007",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    stock: 3,
    status: "low-stock",
    sku: "ELEC-KB-007",
  },
  {
    id: "PRD-1008",
    name: "Adjustable Standing Desk",
    category: "Furniture",
    price: 349.99,
    stock: 0,
    status: "out-of-stock",
    sku: "FURN-SD-008",
  }
];

type InventoryStatus = "all" | "in-stock" | "low-stock" | "out-of-stock";

const AdminInventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<InventoryStatus>("all");
  const [showDiscontinued, setShowDiscontinued] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("PRD-1001");

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTab = activeTab === "all" || product.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getStockBadge = (status: string, stock: number) => {
    switch (status) {
      case "in-stock":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            In Stock ({stock})
          </Badge>
        );
      case "low-stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Low Stock ({stock})
          </Badge>
        );
      case "out-of-stock":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Out of Stock
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Inventory Management - IntelliOrder Admin</title>
      </Helmet>
      
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your product inventory across all warehouses.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-discontinued"
                  checked={showDiscontinued}
                  onCheckedChange={setShowDiscontinued}
                />
                <label
                  htmlFor="show-discontinued"
                  className="text-sm font-medium cursor-pointer"
                >
                  Show discontinued
                </label>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Electronics</DropdownMenuItem>
                  <DropdownMenuItem>Furniture</DropdownMenuItem>
                  <DropdownMenuItem>Accessories</DropdownMenuItem>
                  <DropdownMenuItem>All Categories</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
              
              <Button variant="default" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ForecastChart productId={selectedProductId} />
            </div>
            <div>
              <RestockRecommendation productId={selectedProductId} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
                  <p className="text-2xl font-bold mt-1">{mockProducts.length}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Low Stock Items</h3>
                  <p className="text-2xl font-bold mt-1">{mockProducts.filter(p => p.status === "low-stock").length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Out of Stock</h3>
                  <p className="text-2xl font-bold mt-1">{mockProducts.filter(p => p.status === "out-of-stock").length}</p>
                </div>
                <BarChart className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as InventoryStatus)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="in-stock">In Stock</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Status</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <TableRow 
                          key={product.id} 
                          className={`cursor-pointer hover:bg-muted/50 ${selectedProductId === product.id ? 'bg-muted/50' : ''}`}
                          onClick={() => setSelectedProductId(product.id)}
                        >
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{getStockBadge(product.status, product.stock)}</TableCell>
                          <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No products found.
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

export default AdminInventoryPage;

