import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Filter, AlertTriangle, ArrowUpDown, ShieldAlert, Check, X, Eye, Download } from "lucide-react";
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

import FraudScoreBadge from "@/components/fraud/fraud-score-badge";
import FraudFeaturesDisplay from "@/components/fraud/fraud-features-display";
import { useFraudCases } from "@/hooks/fraud/use-fraud-cases";
import { useUpdateFraudCase } from "@/hooks/fraud/use-update-fraud-case";
import { exportToCSV } from "@/utils/export-utils";

type FraudStatus = "pending-review" | "marked-safe" | "confirmed-fraud" | "all";

const AdminFraudPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<FraudStatus>("all");
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();

  const { data: fraudCases = [], isLoading, error } = useFraudCases(
    activeTab === "all" ? undefined : activeTab,
    100
  );
  
  const updateFraudCase = useUpdateFraudCase();
  
  const filteredTransactions = fraudCases.filter(transaction => {
    const matchesSearch = 
      transaction.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customer_name && transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    let matchesDateFilter = true;
    if (filterDays) {
      const createdAt = new Date(transaction.created_at);
      const daysAgo = (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      matchesDateFilter = daysAgo <= filterDays;
    }
    
    return matchesSearch && matchesDateFilter;
  });
  
  const handleStatusUpdate = (transactionId: string, newStatus: FraudStatus) => {
    if (newStatus === "all") return;
    
    updateFraudCase.mutate({ 
      caseId: transactionId, 
      status: newStatus,
      notes: `Status updated to ${newStatus} on ${new Date().toISOString()}`
    });
  };
  
  const viewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };
  
  const handleExport = () => {
    exportToCSV(
      filteredTransactions.map(t => ({
        transaction_id: t.transaction_id,
        status: t.status,
        risk_score: t.risk_score,
        created_at: new Date(t.created_at).toLocaleString(),
        updated_at: new Date(t.updated_at).toLocaleString(),
        notes: t.notes || ""
      })),
      `fraud-cases-${activeTab}-${new Date().toISOString().split('T')[0]}`
    );
    
    toast({
      title: "Export successful",
      description: `Exported ${filteredTransactions.length} fraud cases.`,
    });
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
                  <DropdownMenuItem onClick={() => setFilterDays(7)}>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDays(30)}>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDays(90)}>Last 90 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDays(null)}>All time</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Export
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
              {isLoading ? (
                <div className="h-24 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="h-24 flex items-center justify-center text-destructive">
                  Error loading fraud cases
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                            <TableCell>{transaction.order_id || "N/A"}</TableCell>
                            <TableCell>
                              <FraudScoreBadge transactionId={transaction.transaction_id} score={transaction.risk_score} />
                            </TableCell>
                            <TableCell>
                              {transaction.status === "pending-review" ? (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Pending Review
                                </Badge>
                              ) : transaction.status === "marked-safe" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  Marked Safe
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
                                  <ShieldAlert className="h-3 w-3" />
                                  Confirmed Fraud
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
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
                          <TableCell colSpan={6} className="h-24 text-center">
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
      
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
                  <p className="font-medium">{selectedTransaction.transaction_id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Order ID</h4>
                  <p className="font-medium">{selectedTransaction.order_id || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                  <p className="font-medium">{selectedTransaction.customer_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                  <p className="font-medium">{new Date(selectedTransaction.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Amount</h4>
                  <p className="font-medium">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                  <p className="font-medium">{selectedTransaction.payment_method}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Risk Level</h4>
                <div>
                  <FraudScoreBadge transactionId={selectedTransaction.transaction_id} showScore={true} />
                </div>
              </div>
              
              <FraudFeaturesDisplay transactionId={selectedTransaction.transaction_id} />
              
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
                      handleStatusUpdate(selectedTransaction.transaction_id, "marked-safe");
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
                      handleStatusUpdate(selectedTransaction.transaction_id, "confirmed-fraud");
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
