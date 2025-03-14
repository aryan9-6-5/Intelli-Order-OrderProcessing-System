
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { DownloadCloud, Calendar, BarChart3, LineChart, PieChart } from "lucide-react";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

// Mock data for sales chart
const salesData = [
  { name: "Jan", revenue: 4000, profit: 2400, orders: 240 },
  { name: "Feb", revenue: 3000, profit: 1398, orders: 210 },
  { name: "Mar", revenue: 9800, profit: 2000, orders: 290 },
  { name: "Apr", revenue: 3908, profit: 2780, orders: 300 },
  { name: "May", revenue: 4800, profit: 1890, orders: 310 },
  { name: "Jun", revenue: 3800, profit: 2390, orders: 250 },
  { name: "Jul", revenue: 4300, profit: 3490, orders: 280 },
];

// Mock data for product categories
const productCategoryData = [
  { name: "Electronics", value: 400 },
  { name: "Furniture", value: 300 },
  { name: "Clothing", value: 300 },
  { name: "Books", value: 200 },
  { name: "Food", value: 100 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock data for customer analytics
const customerData = [
  { name: "Jan", newCustomers: 40, returningCustomers: 24 },
  { name: "Feb", newCustomers: 30, returningCustomers: 38 },
  { name: "Mar", newCustomers: 20, returningCustomers: 50 },
  { name: "Apr", newCustomers: 27, returningCustomers: 39 },
  { name: "May", newCustomers: 18, returningCustomers: 48 },
  { name: "Jun", newCustomers: 23, returningCustomers: 38 },
  { name: "Jul", newCustomers: 34, returningCustomers: 43 },
];

type ReportType = "sales" | "products" | "customers";

const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState<ReportType>("sales");
  
  return (
    <>
      <Helmet>
        <title>Analytics & Reports - IntelliOrder Admin</title>
      </Helmet>
      
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
              <p className="text-muted-foreground mt-1">
                View business insights and performance metrics.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(), "MMM d, yyyy")}
              </Button>
              <Button variant="default" size="sm" className="flex items-center gap-1">
                <DownloadCloud className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as ReportType)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sales" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Sales & Revenue
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                Product Analytics
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                Customer Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                  <p className="text-2xl font-bold mt-1">$34,587.00</p>
                  <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
                </div>
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                  <p className="text-2xl font-bold mt-1">2,456</p>
                  <p className="text-xs text-green-500 mt-1">+8.2% from last month</p>
                </div>
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Order Value</h3>
                  <p className="text-2xl font-bold mt-1">$140.75</p>
                  <p className="text-xs text-green-500 mt-1">+3.1% from last month</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue ($)" fill="#8884d8" />
                      <Bar dataKey="profit" name="Profit ($)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Order Trends</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="orders" name="Orders" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Product Categories Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={productCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {productCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Premium Bluetooth Headphones", sales: 342, revenue: "$51,299" },
                      { name: "Ergonomic Office Chair", sales: 256, revenue: "$63,999" },
                      { name: "Ultra HD Monitor 27-inch", sales: 187, revenue: "$56,097" },
                      { name: "Mechanical Keyboard", sales: 154, revenue: "$20,018" },
                      { name: "Wireless Gaming Mouse", sales: 143, revenue: "$11,439" },
                    ].map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.sales} units sold
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {product.revenue}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { category: "Electronics", inStock: 45, lowStock: 12, outOfStock: 3 },
                        { category: "Furniture", inStock: 22, lowStock: 8, outOfStock: 5 },
                        { category: "Accessories", inStock: 34, lowStock: 6, outOfStock: 2 },
                        { category: "Books", inStock: 18, lowStock: 4, outOfStock: 1 },
                        { category: "Food", inStock: 9, lowStock: 3, outOfStock: 0 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inStock" name="In Stock" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="lowStock" name="Low Stock" stackId="a" fill="#ffc658" />
                      <Bar dataKey="outOfStock" name="Out of Stock" stackId="a" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customers" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Customers</h3>
                  <p className="text-2xl font-bold mt-1">12,456</p>
                  <p className="text-xs text-green-500 mt-1">+5.3% from last month</p>
                </div>
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="text-sm font-medium text-muted-foreground">New Customers</h3>
                  <p className="text-2xl font-bold mt-1">1,243</p>
                  <p className="text-xs text-green-500 mt-1">+7.1% from last month</p>
                </div>
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="text-sm font-medium text-muted-foreground">Returning Rate</h3>
                  <p className="text-2xl font-bold mt-1">68.4%</p>
                  <p className="text-xs text-green-500 mt-1">+2.5% from last month</p>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-lg font-semibold mb-4">Customer Growth</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={customerData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="newCustomers"
                        name="New Customers"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="returningCustomers" name="Returning Customers" stroke="#82ca9d" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Customer Demographics</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: "18-24", value: 15 },
                            { name: "25-34", value: 35 },
                            { name: "35-44", value: 25 },
                            { name: "45-54", value: 15 },
                            { name: "55+", value: 10 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {productCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Top Customer Locations</h3>
                  <div className="space-y-4">
                    {[
                      { city: "New York", customers: 1245, percentage: "18%" },
                      { city: "Los Angeles", customers: 982, percentage: "14%" },
                      { city: "Chicago", customers: 875, percentage: "12%" },
                      { city: "Houston", customers: 654, percentage: "9%" },
                      { city: "Phoenix", customers: 512, percentage: "7%" },
                    ].map((location, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium text-primary">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{location.city}</div>
                            <div className="text-sm text-muted-foreground">
                              {location.customers} customers
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">
                          {location.percentage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminReportsPage;
