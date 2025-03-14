
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Filter, AlertTriangle, CheckCircle, ChevronRight, BarChart2, Eye, ShieldAlert, UserCheck, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const RiskLevelBadge = ({ level }: { level: string }) => {
  const levelColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
    cleared: "bg-blue-100 text-blue-800"
  };
  
  return (
    <Badge className={levelColors[level as keyof typeof levelColors]} variant="outline">
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  );
};

const mockCases = [
  {
    id: "F-10023",
    orderId: "ORD-12567",
    customer: "John Smith",
    email: "j.smith@example.com",
    date: "2023-04-10",
    riskLevel: "high",
    riskScore: 87,
    total: "$950.75",
    triggerFlags: ["Mismatched billing/shipping", "High-value order", "New account"],
    ipAddress: "192.168.1.1",
    location: "New York, USA",
    paymentMethod: "Credit Card (Visa ending in 4567)",
    status: "under review"
  },
  {
    id: "F-10024",
    orderId: "ORD-12568",
    customer: "Emma Davis",
    email: "e.davis@example.com",
    date: "2023-04-09",
    riskLevel: "medium",
    riskScore: 65,
    total: "$425.50",
    triggerFlags: ["Multiple failed payment attempts", "Unusual time of purchase"],
    ipAddress: "192.168.1.2",
    location: "Chicago, USA",
    paymentMethod: "Credit Card (Mastercard ending in 8901)",
    status: "under review"
  },
  {
    id: "F-10025",
    orderId: "ORD-12569",
    customer: "Michael Johnson",
    email: "m.johnson@example.com",
    date: "2023-04-08",
    riskLevel: "low",
    riskScore: 35,
    total: "$129.99",
    triggerFlags: ["Different device than usual"],
    ipAddress: "192.168.1.3",
    location: "Los Angeles, USA",
    paymentMethod: "PayPal (m.johnson@example.com)",
    status: "cleared"
  },
  {
    id: "F-10026",
    orderId: "ORD-12570",
    customer: "Sophia Wilson",
    email: "s.wilson@example.com",
    date: "2023-04-07",
    riskLevel: "cleared",
    riskScore: 15,
    total: "$89.95",
    triggerFlags: ["Previously flagged but cleared"],
    ipAddress: "192.168.1.4",
    location: "Miami, USA",
    paymentMethod: "Credit Card (Amex ending in 3456)",
    status: "cleared"
  },
  {
    id: "F-10027",
    orderId: "ORD-12571",
    customer: "Robert Martinez",
    email: "r.martinez@example.com",
    date: "2023-04-06",
    riskLevel: "high",
    riskScore: 92,
    total: "$1,299.00",
    triggerFlags: ["Multiple shipping addresses", "High-value order", "International shipping", "New account"],
    ipAddress: "192.168.1.5",
    location: "Unknown location (VPN detected)",
    paymentMethod: "Credit Card (Visa ending in 7890)",
    status: "flagged"
  }
];

const SupportFraudPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [fraudCases, setFraudCases] = useState(mockCases);
  const [selectedCase, setSelectedCase] = useState(mockCases[0]);
  
  const filteredCases = fraudCases.filter(c => 
    (currentTab === "all" || 
     (currentTab === "high" && c.riskLevel === "high") ||
     (currentTab === "medium" && c.riskLevel === "medium") ||
     (currentTab === "low" && c.riskLevel === "low") ||
     (currentTab === "cleared" && c.riskLevel === "cleared")) &&
    (c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const markAsCleared = (caseId: string) => {
    setFraudCases(fraudCases.map(c => 
      c.id === caseId ? { ...c, riskLevel: "cleared", status: "cleared" } : c
    ));
    
    setSelectedCase(prev => ({ ...prev, riskLevel: "cleared", status: "cleared" }));
    
    toast({
      title: "Case cleared",
      description: `Fraud case ${caseId} has been cleared and marked as legitimate.`
    });
  };
  
  const escalateCase = (caseId: string) => {
    toast({
      title: "Case escalated",
      description: `Fraud case ${caseId} has been escalated to the security team.`
    });
  };

  return (
    <>
      <Helmet>
        <title>Fraud Cases - IntelliOrder Support</title>
      </Helmet>
      
      <DashboardLayout role="support">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fraud Cases</h1>
            <p className="text-muted-foreground mt-1">
              Review and manage potential fraud cases
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-red-100 p-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-yellow-100 p-2 text-yellow-600">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-green-100 p-2 text-green-600">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-600">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cleared</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by case ID, order ID, or customer" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="high">High Risk</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="low">Low Risk</TabsTrigger>
              <TabsTrigger value="cleared">Cleared</TabsTrigger>
            </TabsList>
            
            <TabsContent value={currentTab} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Fraud Cases</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {filteredCases.length > 0 ? (
                          filteredCases.map(fraudCase => (
                            <div 
                              key={fraudCase.id}
                              className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedCase.id === fraudCase.id ? 'bg-muted' : ''}`}
                              onClick={() => setSelectedCase(fraudCase)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{fraudCase.id}</div>
                                  <div className="text-sm text-muted-foreground">{fraudCase.customer}</div>
                                </div>
                                <RiskLevelBadge level={fraudCase.riskLevel} />
                              </div>
                              <div className="flex justify-between mt-1 text-sm">
                                <div>{fraudCase.date}</div>
                                <div className="font-medium">{fraudCase.total}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-muted-foreground">No fraud cases found.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Case Details</CardTitle>
                      <div className="flex gap-2">
                        {selectedCase.riskLevel !== "cleared" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() => escalateCase(selectedCase.id)}
                            >
                              <ShieldAlert className="h-4 w-4" />
                              Escalate
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => markAsCleared(selectedCase.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Clear Case
                            </Button>
                          </>
                        )}
                        {selectedCase.riskLevel === "cleared" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                              toast({
                                title: "Case details exported",
                                description: "Case details have been exported to CSV."
                              });
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                          <div>
                            <h3 className="font-semibold text-lg">{selectedCase.id}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span>Order {selectedCase.orderId}</span>
                              <span>•</span>
                              <span>Detected on {selectedCase.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center mt-2 md:mt-0">
                            <RiskLevelBadge level={selectedCase.riskLevel} />
                            <div className="ml-3 text-sm">
                              <span className="font-semibold">Risk Score: </span>
                              <span className={
                                selectedCase.riskScore > 70 ? "text-red-600" : 
                                selectedCase.riskScore > 40 ? "text-yellow-600" : 
                                "text-green-600"
                              }>
                                {selectedCase.riskScore}/100
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="shadow-none border border-muted">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Order Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Customer:</span>
                                <span className="font-medium">{selectedCase.customer}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span>{selectedCase.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Order Total:</span>
                                <span className="font-bold">{selectedCase.total}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <span>{selectedCase.paymentMethod}</span>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="shadow-none border border-muted">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Risk Indicators</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <ul className="space-y-1">
                                {selectedCase.triggerFlags.map((flag, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <AlertTriangle className={`h-4 w-4 ${
                                      flag.includes("High-value") || flag.includes("Mismatched") || flag.includes("Multiple shipping") || flag.includes("International shipping")
                                        ? "text-red-500" 
                                        : flag.includes("Multiple failed") || flag.includes("Unusual")
                                          ? "text-yellow-500"
                                          : "text-blue-500"
                                    }`} />
                                    <span>{flag}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="shadow-none border border-muted">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Location Data</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">IP Address:</span>
                                <span>{selectedCase.ipAddress}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Location:</span>
                                <span>{selectedCase.location}</span>
                              </div>
                              <div className="h-32 bg-muted/60 rounded-md flex items-center justify-center">
                                <span className="text-sm text-muted-foreground">Location map placeholder</span>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="shadow-none border border-muted">
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base">Risk Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="h-32 bg-muted/60 rounded-md flex items-center justify-center mb-2">
                                <BarChart2 className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <p className="text-sm">
                                {selectedCase.riskLevel === "high" && "This order has multiple high-risk indicators and requires immediate review."}
                                {selectedCase.riskLevel === "medium" && "This order has some concerning patterns but may be legitimate."}
                                {selectedCase.riskLevel === "low" && "This order has minor risk indicators but is likely legitimate."}
                                {selectedCase.riskLevel === "cleared" && "This order has been reviewed and cleared as legitimate."}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-2">Action History</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Eye className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Case created</span>
                                  <span className="text-sm text-muted-foreground">
                                    {selectedCase.date} at 10:30 AM
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  System automatically flagged order as potentially fraudulent with a risk score of {selectedCase.riskScore}.
                                </p>
                              </div>
                            </div>
                            
                            {selectedCase.riskLevel === "cleared" && (
                              <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Case cleared</span>
                                    <span className="text-sm text-muted-foreground">
                                      Today at {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Case was reviewed and cleared by support agent.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SupportFraudPage;
