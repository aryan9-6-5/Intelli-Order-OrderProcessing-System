
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Filter, Check, X, CreditCard, ArrowRight, Calendar, PlusCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const RefundStatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    processed: "bg-blue-100 text-blue-800"
  };
  
  return (
    <Badge className={statusColors[status as keyof typeof statusColors]} variant="outline">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const mockRefunds = [
  {
    id: "REF-5001",
    orderId: "ORD-12349",
    customer: "Robert Wilson",
    email: "r.wilson@example.com",
    amount: "$156.75",
    reason: "Damaged product",
    date: "2023-04-05",
    status: "pending",
    items: [{ name: "Wireless Headphones", price: "$89.99" }, { name: "Smart Watch", price: "$66.76" }]
  },
  {
    id: "REF-5002",
    orderId: "ORD-12350",
    customer: "Alice Johnson",
    email: "a.johnson@example.com",
    amount: "$42.99",
    reason: "Wrong item received",
    date: "2023-04-04",
    status: "approved",
    items: [{ name: "Bluetooth Speaker", price: "$42.99" }]
  },
  {
    id: "REF-5003",
    orderId: "ORD-12351",
    customer: "David Miller",
    email: "d.miller@example.com",
    amount: "$120.50",
    reason: "No longer needed",
    date: "2023-04-03",
    status: "rejected",
    items: [{ name: "Fitness Tracker", price: "$120.50" }]
  },
  {
    id: "REF-5004",
    orderId: "ORD-12352",
    customer: "Sophia Lee",
    email: "s.lee@example.com",
    amount: "$89.99",
    reason: "Item not as described",
    date: "2023-04-02",
    status: "processed",
    items: [{ name: "Portable Charger", price: "$35.99" }, { name: "USB Cable Pack", price: "$54.00" }]
  },
  {
    id: "REF-5005",
    orderId: "ORD-12353",
    customer: "James Brown",
    email: "j.brown@example.com",
    amount: "$210.25",
    reason: "Better price found",
    date: "2023-04-01",
    status: "pending",
    items: [{ name: "Gaming Controller", price: "$69.99" }, { name: "Wireless Keyboard", price: "$110.50" }, { name: "Mouse", price: "$29.76" }]
  }
];

const SupportRefundsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [refunds, setRefunds] = useState(mockRefunds);
  const [selectedRefund, setSelectedRefund] = useState(mockRefunds[0]);
  
  const filteredRefunds = refunds.filter(refund => 
    (currentTab === "all" || refund.status === currentTab) &&
    (refund.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     refund.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
     refund.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     refund.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleApproveRefund = (refundId: string) => {
    setRefunds(refunds.map(refund => 
      refund.id === refundId ? { ...refund, status: "approved" } : refund
    ));
    
    setSelectedRefund(prev => ({ ...prev, status: "approved" }));
    
    toast({
      title: "Refund approved",
      description: `Refund ${refundId} has been approved successfully.`
    });
  };
  
  const handleRejectRefund = (refundId: string) => {
    setRefunds(refunds.map(refund => 
      refund.id === refundId ? { ...refund, status: "rejected" } : refund
    ));
    
    setSelectedRefund(prev => ({ ...prev, status: "rejected" }));
    
    toast({
      title: "Refund rejected",
      description: `Refund ${refundId} has been rejected.`
    });
  };
  
  const handleProcessRefund = (refundId: string) => {
    setRefunds(refunds.map(refund => 
      refund.id === refundId ? { ...refund, status: "processed" } : refund
    ));
    
    setSelectedRefund(prev => ({ ...prev, status: "processed" }));
    
    toast({
      title: "Refund processed",
      description: `Refund ${refundId} has been processed and payment issued.`
    });
  };

  return (
    <>
      <Helmet>
        <title>Refund Processing - IntelliOrder Support</title>
      </Helmet>
      
      <DashboardLayout role="support">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Refund Processing</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer refund requests
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by refund ID, order ID, or customer" 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="flex items-center gap-2" onClick={() => {
              toast({
                title: "Creating new refund",
                description: "The new refund feature is under development."
              });
            }}>
              <PlusCircle className="h-4 w-4" />
              New Refund
            </Button>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="processed">Processed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value={currentTab} className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">Refund Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {filteredRefunds.length > 0 ? (
                          filteredRefunds.map(refund => (
                            <div 
                              key={refund.id}
                              className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedRefund.id === refund.id ? 'bg-muted' : ''}`}
                              onClick={() => setSelectedRefund(refund)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{refund.id}</div>
                                  <div className="text-sm text-muted-foreground">{refund.customer}</div>
                                </div>
                                <RefundStatusBadge status={refund.status} />
                              </div>
                              <div className="flex justify-between mt-1 text-sm">
                                <div>{refund.date}</div>
                                <div className="font-medium">{refund.amount}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-muted-foreground">No refunds found.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">Refund Details</CardTitle>
                      <div className="flex gap-2">
                        {selectedRefund.status === "pending" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() => handleRejectRefund(selectedRefund.id)}
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => handleApproveRefund(selectedRefund.id)}
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                          </>
                        )}
                        {selectedRefund.status === "approved" && (
                          <Button 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => handleProcessRefund(selectedRefund.id)}
                          >
                            <CreditCard className="h-4 w-4" />
                            Process Refund
                          </Button>
                        )}
                        {selectedRefund.status === "processed" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => {
                                toast({
                                  title: "Email sent",
                                  description: "Confirmation email has been sent to the customer."
                                });
                              }}>
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                toast({
                                  title: "Receipt generated",
                                  description: "Refund receipt has been generated."
                                });
                              }}>
                                Generate Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{selectedRefund.id}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>Requested on {selectedRefund.date}</span>
                            </div>
                          </div>
                          <RefundStatusBadge status={selectedRefund.status} />
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Refund Information
                            </h4>
                            <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Customer:</span>
                                <span className="font-medium">{selectedRefund.customer}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span>{selectedRefund.email}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Order ID:</span>
                                <span>{selectedRefund.orderId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="font-bold">{selectedRefund.amount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Reason:</span>
                                <span>{selectedRefund.reason}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <h4 className="font-medium">Items Being Refunded</h4>
                            <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                              {selectedRefund.items.map((item, index) => (
                                <div key={index} className="flex justify-between py-1 border-b last:border-0">
                                  <span>{item.name}</span>
                                  <span className="font-medium">{item.price}</span>
                                </div>
                              ))}
                              <div className="flex justify-between pt-2 font-bold">
                                <span>Total Refund:</span>
                                <span>{selectedRefund.amount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Refund Status Timeline</h4>
                          <div className="bg-muted/40 p-4 rounded-lg space-y-4">
                            <div className="flex">
                              <div className="mr-4 flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <div className="w-0.5 h-full bg-border" />
                              </div>
                              <div className="pb-5">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Refund Requested</span>
                                  <span className="text-sm text-muted-foreground">
                                    {selectedRefund.date} at 11:30 AM
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Customer requested a refund for {selectedRefund.amount} with reason: {selectedRefund.reason}
                                </p>
                              </div>
                            </div>
                            
                            {(selectedRefund.status === "approved" || selectedRefund.status === "processed" || selectedRefund.status === "rejected") && (
                              <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                  {selectedRefund.status === "approved" && <div className="w-0.5 h-full bg-border" />}
                                </div>
                                <div className="pb-5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {selectedRefund.status === "rejected" ? "Refund Rejected" : "Refund Approved"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {selectedRefund.date.split('-')[0]}-{selectedRefund.date.split('-')[1]}-{Number(selectedRefund.date.split('-')[2])+1} at 2:15 PM
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedRefund.status === "rejected" 
                                      ? "Refund request was rejected due to policy violation." 
                                      : "Refund request was approved and queued for processing."}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {selectedRefund.status === "processed" && (
                              <div className="flex">
                                <div className="mr-4 flex flex-col items-center">
                                  <div className="w-3 h-3 rounded-full bg-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Refund Processed</span>
                                    <span className="text-sm text-muted-foreground">
                                      {selectedRefund.date.split('-')[0]}-{selectedRefund.date.split('-')[1]}-{Number(selectedRefund.date.split('-')[2])+2} at 10:45 AM
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Refund of {selectedRefund.amount} was processed and funds were returned to customer's original payment method.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-2">Notes</h4>
                          <div className="flex gap-2">
                            <Input placeholder="Add a note about this refund" />
                            <Button variant="outline">Add Note</Button>
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

export default SupportRefundsPage;
