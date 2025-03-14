
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Filter, AlertTriangle, ArrowUpDown, ShieldAlert, Check, X, Eye } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data
const mockSuspiciousTransactions = [
  {
    id: "TRX-8976",
    orderId: "ORD-3488",
    customer: "Sarah Wilson",
    date: "2023-10-14",
    amount: 899.99,
    status: "pending-review",
    riskLevel: "high",
    flags: ["unusual_location", "large_amount", "new_device"],
    paymentMethod: "Credit Card (ending in 3421)",
  },
  {
    id: "TRX-8965",
    orderId: "ORD-3484",
    customer: "Lisa Martinez",
    date: "2023-10-12",
    amount: 499.99,
    status: "pending-review",
    riskLevel: "medium",
    flags: ["multiple_attempts", "address_mismatch"],
    paymentMethod: "PayPal",
  },
  {
    id: "TRX-8934",
    orderId: "ORD-3452",
    customer: "Brandon Taylor",
    date: "2023-10-09",
    amount: 1299.99,
    status: "marked-safe",
    riskLevel: "low",
    flags: ["unusual_time", "high_value"],
    paymentMethod: "Credit Card (ending in 7890)",
  },
  {
    id: "TRX-8912",
    orderId: "ORD-3434",
    customer: "Alex Rodriguez",
    date: "2023-10-07",
    amount: 899.99,
    status: "confirmed-fraud",
    riskLevel: "critical",
    flags: ["stolen_card", "vpn_detected", "multiple_locations"],
    paymentMethod: "Credit Card (ending in 1234)",
  },
  {
    id: "TRX-8899",
    orderId: "ORD-3421",
    customer: "Jordan Lee",
    date: "2023-10-05",
    amount: 749.99,
    status: "pending-review",
    riskLevel: "high",
    flags: ["unusual_behavior", "expedited_shipping", "different_name"],
    paymentMethod: "Credit Card (ending in 5678)",
  },
  {
    id: "TRX-8877",
    orderId: "ORD-3409",
    customer: "Morgan Williams",
    date: "2023-10-03",
    amount: 299.99,
    status: "marked-safe",
    riskLevel: "medium",
    flags: ["first_purchase", "international"],
    paymentMethod: "Credit Card (ending in 9012)",
  },
];

type FraudStatus = "pending-review" | "marked-safe" | "confirmed-fraud" | "all";

const AdminFraudPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FraudStatus>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  
  const filteredTransactions = mockSuspiciousTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTab = activeTab === "all" || transaction.status === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  const handleStatusUpdate = (transactionId: string, newStatus: FraudStatus) => {
    if (newStatus === "all") return;
    
    // In a real app, this would call an API to update the status
    toast({
      title: "Status updated",
      description: `Transaction ${transactionId} marked as ${newStatus.replace('-', ' ')}`,
    });
  };
  
  const viewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };
  
  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Critical
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Low
          </Badge>
        );
      default:
        return <Badge>{riskLevel}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending-review":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Pending Review
          </Badge>
        );
      case "marked-safe":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Marked Safe
          </Badge>
        );
      case "confirmed-fraud":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Confirmed Fraud
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Fraud Detection - IntelliOrder Admin</title>
      </Helmet>
      
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fraud Detection</h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage potential fraudulent transactions in your store.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
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
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>High risk only</DropdownMenuItem>
                  <DropdownMenuItem>Critical risk only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as FraudStatus)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="pending-review">Pending Review</TabsTrigger>
              <TabsTrigger value="marked-safe">Marked Safe</TabsTrigger>
              <TabsTrigger value="confirmed-fraud">Confirmed Fraud</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
                          <TableCell>{transaction.customer}</TableCell>
                          <TableCell>{transaction.orderId}</TableCell>
                          <TableCell>{getRiskBadge(transaction.riskLevel)}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => viewDetails(transaction)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <span className="sr-only">Actions</span>
                                    <AlertTriangle className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background">
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(transaction.id, "marked-safe")}
                                    className="text-green-600 focus:text-green-600"
                                  >
                                    <Check className="mr-2 h-4 w-4" />
                                    Mark as Safe
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleStatusUpdate(transaction.id, "confirmed-fraud")}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Confirm as Fraud
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No transactions found.
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
      
      {/* Transaction Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed information about the flagged transaction.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Transaction ID</h4>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Order ID</h4>
                  <p className="font-medium">{selectedTransaction.orderId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                  <p className="font-medium">{selectedTransaction.customer}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p className="font-medium">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                  <p className="font-medium">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                  <p className="font-medium">{selectedTransaction.paymentMethod}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Risk Level</h4>
                <div>{getRiskBadge(selectedTransaction.riskLevel)}</div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Detected Flags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTransaction.flags.map((flag: string) => (
                    <Badge key={flag} variant="outline">
                      {flag.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setDetailsOpen(false)}
            >
              Close
            </Button>
            <div className="flex gap-2">
              {selectedTransaction && (
                <>
                  <Button 
                    variant="outline"
                    className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => {
                      handleStatusUpdate(selectedTransaction.id, "marked-safe");
                      setDetailsOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Safe
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      handleStatusUpdate(selectedTransaction.id, "confirmed-fraud");
                      setDetailsOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Confirm as Fraud
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminFraudPage;
