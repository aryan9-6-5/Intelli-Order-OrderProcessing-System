
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Package, 
  PackageOpen, 
  Search, 
  Filter, 
  ArrowDown, 
  ArrowUp, 
  Check, 
  X, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Mock data for restock requests
const mockRestockRequests = [
  {
    id: "RST-1001",
    productId: "PRD-5023",
    productName: "Wireless Headphones",
    category: "Electronics",
    currentStock: 8,
    minStockLevel: 15,
    requestedQuantity: 30,
    status: "pending",
    priority: "high",
    requestDate: "2023-08-10T09:15:00",
    supplier: "AudioTech Inc.",
    estimatedArrival: "2023-08-18T00:00:00",
    notes: "Stock levels critically low, please expedite."
  },
  {
    id: "RST-1002",
    productId: "PRD-4287",
    productName: "Smart Watch Pro",
    category: "Electronics",
    currentStock: 12,
    minStockLevel: 20,
    requestedQuantity: 25,
    status: "approved",
    priority: "medium",
    requestDate: "2023-08-11T14:30:00",
    supplier: "TechGadgets Ltd",
    estimatedArrival: "2023-08-20T00:00:00",
    notes: "Regular monthly restock."
  },
  {
    id: "RST-1003",
    productId: "PRD-3142",
    productName: "Bluetooth Speaker",
    category: "Electronics",
    currentStock: 5,
    minStockLevel: 10,
    requestedQuantity: 20,
    status: "pending",
    priority: "high",
    requestDate: "2023-08-12T11:45:00",
    supplier: "SoundWaves Corp",
    estimatedArrival: "",
    notes: "Popular item, stock depleting quickly."
  },
  {
    id: "RST-1004",
    productId: "PRD-7865",
    productName: "Laptop Sleeve",
    category: "Accessories",
    currentStock: 18,
    minStockLevel: 15,
    requestedQuantity: 30,
    status: "approved",
    priority: "low",
    requestDate: "2023-08-09T16:20:00",
    supplier: "AccessorizeMe Inc.",
    estimatedArrival: "2023-08-19T00:00:00",
    notes: "Proactive restock before levels drop."
  },
  {
    id: "RST-1005",
    productId: "PRD-6531",
    productName: "Wireless Mouse",
    category: "Accessories",
    currentStock: 6,
    minStockLevel: 12,
    requestedQuantity: 24,
    status: "shipped",
    priority: "medium",
    requestDate: "2023-08-08T10:10:00",
    supplier: "TechGadgets Ltd",
    estimatedArrival: "2023-08-15T00:00:00",
    notes: "Regular restock of popular item."
  },
  {
    id: "RST-1006",
    productId: "PRD-2198",
    productName: "4K Monitor",
    category: "Electronics",
    currentStock: 3,
    minStockLevel: 5,
    requestedQuantity: 10,
    status: "received",
    priority: "high",
    requestDate: "2023-08-05T13:45:00",
    supplier: "DisplayTech Solutions",
    estimatedArrival: "2023-08-13T00:00:00",
    receivedDate: "2023-08-13T11:30:00",
    receivedQuantity: 10,
    notes: "High-value items, handle with care."
  },
  {
    id: "RST-1007",
    productId: "PRD-9043",
    productName: "Wireless Earbuds",
    category: "Electronics",
    currentStock: 14,
    minStockLevel: 10,
    requestedQuantity: 20,
    status: "cancelled",
    priority: "low",
    requestDate: "2023-08-07T09:30:00",
    supplier: "AudioTech Inc.",
    estimatedArrival: "",
    notes: "Cancelled due to product line update coming next month."
  }
];

// Status definitions
const restockStatuses = {
  pending: { label: "Pending Approval", color: "bg-amber-500" },
  approved: { label: "Approved", color: "bg-blue-500" },
  shipped: { label: "Shipped", color: "bg-purple-500" },
  received: { label: "Received", color: "bg-green-500" },
  cancelled: { label: "Cancelled", color: "bg-destructive" }
};

// Priority definitions
const priorities = {
  high: { label: "High", color: "text-destructive" },
  medium: { label: "Medium", color: "text-amber-500" },
  low: { label: "Low", color: "text-muted-foreground" }
};

const WarehouseRestockPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("requestDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  // Handle sort changes
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // Filter and sort restock requests
  const filteredRequests = mockRestockRequests
    .filter(request => {
      // Search filter
      const searchMatch = searchQuery === "" || 
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.productId.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Priority filter
      const priorityMatch = filterPriority === null || request.priority === filterPriority;
      
      // Status filter
      const statusMatch = filterStatus === null || request.status === filterStatus;
      
      return searchMatch && priorityMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === "requestDate") {
        return sortDirection === "asc" 
          ? new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime() 
          : new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      } else if (sortBy === "currentStock") {
        return sortDirection === "asc" ? a.currentStock - b.currentStock : b.currentStock - a.currentStock;
      } else if (sortBy === "productName") {
        return sortDirection === "asc" 
          ? a.productName.localeCompare(b.productName) 
          : b.productName.localeCompare(a.productName);
      }
      return 0;
    });

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate stock level percentage
  const calculateStockPercentage = (current: number, min: number) => {
    if (min === 0) return 100;
    const percentage = (current / min) * 100;
    return Math.min(percentage, 100);
  };

  // Handle request actions
  const handleRequestAction = (action: 'approve' | 'receive' | 'cancel', request: any) => {
    setSelectedRequest(request);
    setNotes("");
    setIsDialogOpen(true);
  };

  // Submit request action
  const submitRequestAction = () => {
    // In a real app, this would update the database
    console.log(`Action submitted for ${selectedRequest?.id} with notes: ${notes}`);
    setIsDialogOpen(false);
  };

  // Get dialog content based on action
  const getDialogContent = () => {
    if (!selectedRequest) return null;
    
    const actionType = selectedRequest.status === "pending" ? "approve" : 
                      selectedRequest.status === "shipped" ? "receive" : "cancel";
    
    const titles = {
      approve: `Approve Restock Request: ${selectedRequest.id}`,
      receive: `Mark Restock Request as Received: ${selectedRequest.id}`,
      cancel: `Cancel Restock Request: ${selectedRequest.id}`
    };
    
    const descriptions = {
      approve: "Approve this restock request to proceed with ordering from the supplier.",
      receive: "Confirm that the items have been received in the warehouse.",
      cancel: "Cancel this restock request. This action cannot be undone."
    };
    
    return (
      <>
        <DialogHeader>
          <DialogTitle>{titles[actionType as keyof typeof titles]}</DialogTitle>
          <DialogDescription>
            {descriptions[actionType as keyof typeof descriptions]}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="font-medium">Product Details</div>
            <div className="text-sm">
              <div><span className="text-muted-foreground">Product:</span> {selectedRequest.productName}</div>
              <div><span className="text-muted-foreground">Current Stock:</span> {selectedRequest.currentStock}</div>
              <div><span className="text-muted-foreground">Requested Quantity:</span> {selectedRequest.requestedQuantity}</div>
              <div><span className="text-muted-foreground">Supplier:</span> {selectedRequest.supplier}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="font-medium">
              Notes {actionType === "cancel" && <span className="text-destructive">*</span>}
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={actionType === "approve" ? "Additional instructions for the supplier..." : 
                          actionType === "receive" ? "Any notes about the received shipment..." :
                          "Reason for cancellation..."}
              required={actionType === "cancel"}
            />
            {actionType === "receive" && (
              <div className="text-sm text-muted-foreground">
                If the quantity received differs from what was requested, please note it above.
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={submitRequestAction}
            variant={actionType === "cancel" ? "destructive" : "default"}
            disabled={actionType === "cancel" && !notes}
          >
            {actionType === "approve" ? "Approve Request" : 
             actionType === "receive" ? "Confirm Receipt" : 
             "Cancel Request"}
          </Button>
        </DialogFooter>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Restock Requests - IntelliOrder</title>
      </Helmet>
      
      <DashboardLayout role="warehouse">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Restock Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage inventory restock requests and track supplier orders
            </p>
          </div>
          
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by product or ID"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
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
                  variant={filterStatus === "pending" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterStatus(filterStatus === "pending" ? null : "pending")}
                >
                  <PackageOpen className="h-4 w-4 mr-1" />
                  Pending
                </Button>
                <Button 
                  variant={filterStatus === "shipped" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterStatus(filterStatus === "shipped" ? null : "shipped")}
                >
                  <Package className="h-4 w-4 mr-1" />
                  Shipped
                </Button>
              </div>
            </div>
          </div>
          
          {/* Restock Requests Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[150px] cursor-pointer"
                    onClick={() => handleSort("productName")}
                  >
                    Product
                    {sortBy === "productName" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                        <ArrowDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("currentStock")}
                  >
                    Stock Level
                    {sortBy === "currentStock" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                        <ArrowDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="hidden md:table-cell">Supplier</TableHead>
                  <TableHead 
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => handleSort("requestDate")}
                  >
                    Request Date
                    {sortBy === "requestDate" && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="ml-1 h-3 w-3 inline" /> : 
                        <ArrowDown className="ml-1 h-3 w-3 inline" />
                    )}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No restock requests found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="font-medium">{request.productName}</div>
                        <div className="text-xs text-muted-foreground">{request.productId}</div>
                        <div className="text-xs mt-1">
                          <span className={priorities[request.priority as keyof typeof priorities].color}>
                            {priorities[request.priority as keyof typeof priorities].label} Priority
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-24">
                            <Progress 
                              value={calculateStockPercentage(request.currentStock, request.minStockLevel)} 
                              indicatorClassName={cn(
                                request.currentStock < (request.minStockLevel * 0.5) && "bg-destructive",
                                request.currentStock >= (request.minStockLevel * 0.5) && 
                                request.currentStock < request.minStockLevel && "bg-amber-500",
                                request.currentStock >= request.minStockLevel && "bg-green-500"
                              )}
                            />
                          </div>
                          <div className="text-sm">
                            {request.currentStock} / {request.minStockLevel}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.requestedQuantity}</TableCell>
                      <TableCell className="hidden md:table-cell">{request.supplier}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(request.requestDate)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={cn("bg-opacity-20", restockStatuses[request.status as keyof typeof restockStatuses].color)}
                        >
                          {restockStatuses[request.status as keyof typeof restockStatuses].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {request.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleRequestAction('approve', request)}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                          )}
                          {request.status === "shipped" && (
                            <Button
                              size="sm"
                              onClick={() => handleRequestAction('receive', request)}
                            >
                              <Package className="h-4 w-4 mr-1" /> Receive
                            </Button>
                          )}
                          {(request.status === "pending" || request.status === "approved") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestAction('cancel', request)}
                            >
                              <X className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                          )}
                          {(request.status === "received" || request.status === "cancelled") && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                            >
                              No Actions
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {getDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WarehouseRestockPage;
