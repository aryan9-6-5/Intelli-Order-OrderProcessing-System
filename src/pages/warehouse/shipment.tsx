
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Truck, 
  Package, 
  Search, 
  Filter, 
  Check, 
  AlertTriangle, 
  MapPin,
  Clock,
  RefreshCw
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock data for shipments
const mockShipments = [
  {
    id: "SHP-4521",
    orderId: "ORD-9854",
    customerId: "CUST-1234",
    status: "in_transit",
    carrier: "FedEx",
    trackingNumber: "FDX7391824650",
    estimatedDelivery: "2023-08-15T14:00:00",
    currentLocation: "Chicago, IL Distribution Center",
    lastUpdated: "2023-08-13T08:45:00",
    deliveryAddress: "123 Main St, New York, NY 10001",
    progress: 65,
    events: [
      { timestamp: "2023-08-12T16:30:00", location: "Warehouse", status: "Picked up", description: "Package picked up by carrier" },
      { timestamp: "2023-08-12T19:45:00", location: "Regional Hub", status: "Arrived", description: "Package arrived at regional hub" },
      { timestamp: "2023-08-13T02:15:00", location: "Regional Hub", status: "Departed", description: "Package departed from regional hub" },
      { timestamp: "2023-08-13T08:45:00", location: "Chicago, IL", status: "In Transit", description: "Package in transit to destination" }
    ]
  },
  {
    id: "SHP-4522",
    orderId: "ORD-9855",
    customerId: "CUST-5678",
    status: "delivered",
    carrier: "UPS",
    trackingNumber: "UPS9283746501",
    estimatedDelivery: "2023-08-14T12:00:00",
    currentLocation: "New York, NY",
    lastUpdated: "2023-08-14T11:30:00",
    deliveryAddress: "456 Park Ave, New York, NY 10002",
    progress: 100,
    events: [
      { timestamp: "2023-08-13T10:15:00", location: "Warehouse", status: "Picked up", description: "Package picked up by carrier" },
      { timestamp: "2023-08-13T14:30:00", location: "Regional Hub", status: "Arrived", description: "Package arrived at regional hub" },
      { timestamp: "2023-08-13T17:45:00", location: "Regional Hub", status: "Departed", description: "Package departed from regional hub" },
      { timestamp: "2023-08-14T08:20:00", location: "New York, NY", status: "Out for Delivery", description: "Package out for delivery" },
      { timestamp: "2023-08-14T11:30:00", location: "New York, NY", status: "Delivered", description: "Package delivered to recipient" }
    ]
  },
  {
    id: "SHP-4523",
    orderId: "ORD-9856",
    customerId: "CUST-9012",
    status: "out_for_delivery",
    carrier: "USPS",
    trackingNumber: "USPS8172635409",
    estimatedDelivery: "2023-08-14T16:00:00",
    currentLocation: "Local Delivery Route, New York, NY",
    lastUpdated: "2023-08-14T09:15:00",
    deliveryAddress: "789 Broadway, New York, NY 10003",
    progress: 85,
    events: [
      { timestamp: "2023-08-13T11:30:00", location: "Warehouse", status: "Picked up", description: "Package picked up by carrier" },
      { timestamp: "2023-08-13T15:45:00", location: "Regional Hub", status: "Arrived", description: "Package arrived at regional hub" },
      { timestamp: "2023-08-13T18:30:00", location: "Regional Hub", status: "Departed", description: "Package departed from regional hub" },
      { timestamp: "2023-08-14T06:45:00", location: "Local Facility", status: "Arrived", description: "Package arrived at local facility" },
      { timestamp: "2023-08-14T09:15:00", location: "New York, NY", status: "Out for Delivery", description: "Package out for delivery" }
    ]
  },
  {
    id: "SHP-4524",
    orderId: "ORD-9857",
    customerId: "CUST-3456",
    status: "pending",
    carrier: "DHL",
    trackingNumber: "DHL6283910475",
    estimatedDelivery: "2023-08-16T10:00:00",
    currentLocation: "Warehouse",
    lastUpdated: "2023-08-14T07:30:00",
    deliveryAddress: "101 5th Ave, New York, NY 10004",
    progress: 10,
    events: [
      { timestamp: "2023-08-14T07:30:00", location: "Warehouse", status: "Processing", description: "Package is being processed for shipment" }
    ]
  },
  {
    id: "SHP-4525",
    orderId: "ORD-9858",
    customerId: "CUST-7890",
    status: "delayed",
    carrier: "FedEx",
    trackingNumber: "FDX5129384760",
    estimatedDelivery: "2023-08-15T13:00:00",
    currentLocation: "Weather Delay - Denver, CO Hub",
    lastUpdated: "2023-08-14T04:45:00",
    deliveryAddress: "202 Wall St, New York, NY 10005",
    progress: 45,
    events: [
      { timestamp: "2023-08-13T09:15:00", location: "Warehouse", status: "Picked up", description: "Package picked up by carrier" },
      { timestamp: "2023-08-13T13:30:00", location: "Regional Hub", status: "Arrived", description: "Package arrived at regional hub" },
      { timestamp: "2023-08-13T16:45:00", location: "Regional Hub", status: "Departed", description: "Package departed from regional hub" },
      { timestamp: "2023-08-14T01:30:00", location: "Denver, CO", status: "Arrived", description: "Package arrived at intermediate hub" },
      { timestamp: "2023-08-14T04:45:00", location: "Denver, CO", status: "Delayed", description: "Package delayed due to weather conditions" }
    ]
  }
];

// Shipment status definitions
const shipmentStatuses = {
  pending: { label: "Pending", color: "bg-amber-500" },
  in_transit: { label: "In Transit", color: "bg-blue-500" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-purple-500" },
  delivered: { label: "Delivered", color: "bg-green-500" },
  delayed: { label: "Delayed", color: "bg-destructive" },
  exception: { label: "Exception", color: "bg-rose-600" }
};

const WarehouseShipmentPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);

  // Filter shipments
  const filteredShipments = mockShipments.filter(shipment => {
    // Search filter
    const searchMatch = searchQuery === "" || 
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const statusMatch = filterStatus === null || shipment.status === filterStatus;
    
    return searchMatch && statusMatch;
  });

  // Handle shipment expansion/collapse
  const toggleShipmentExpansion = (shipmentId: string) => {
    setExpandedShipmentId(expandedShipmentId === shipmentId ? null : shipmentId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Helmet>
        <title>Shipment Tracking - IntelliOrder</title>
      </Helmet>
      
      <DashboardLayout role="warehouse">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipment Tracking</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all outgoing shipments
            </p>
          </div>
          
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by shipment ID or tracking #"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterStatus(null)}
                >
                  All Shipments
                </Button>
                <Button 
                  variant={filterStatus === "in_transit" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterStatus(filterStatus === "in_transit" ? null : "in_transit")}
                >
                  <Truck className="h-4 w-4 mr-1" />
                  In Transit
                </Button>
                <Button 
                  variant={filterStatus === "out_for_delivery" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterStatus(filterStatus === "out_for_delivery" ? null : "out_for_delivery")}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Out for Delivery
                </Button>
                <Button 
                  variant={filterStatus === "delayed" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterStatus(filterStatus === "delayed" ? null : "delayed")}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Delayed
                </Button>
              </div>
            </div>
          </div>
          
          {/* Shipments Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Shipment ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Carrier</TableHead>
                  <TableHead className="hidden md:table-cell">Est. Delivery</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No shipments found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShipments.map((shipment) => (
                    <React.Fragment key={shipment.id}>
                      <TableRow 
                        className={cn(
                          "cursor-pointer",
                          expandedShipmentId === shipment.id && "bg-muted/50"
                        )}
                        onClick={() => toggleShipmentExpansion(shipment.id)}
                      >
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>{shipment.orderId}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={cn("bg-opacity-20", shipmentStatuses[shipment.status as keyof typeof shipmentStatuses].color)}
                          >
                            {shipmentStatuses[shipment.status as keyof typeof shipmentStatuses].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{shipment.carrier}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(shipment.estimatedDelivery)}
                        </TableCell>
                        <TableCell>
                          <div className="w-32">
                            <Progress 
                              value={shipment.progress} 
                              indicatorClassName={cn(
                                shipment.status === "delayed" && "bg-destructive",
                                shipment.status === "delivered" && "bg-green-500"
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Update tracking for ${shipment.id}`);
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" /> Update
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded View */}
                      {expandedShipmentId === shipment.id && (
                        <TableRow className="bg-muted/30">
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Shipment Details */}
                                <div>
                                  <h3 className="text-sm font-semibold mb-3">Shipment Details</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Tracking Number:</span>
                                      <span className="font-medium">{shipment.trackingNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Carrier:</span>
                                      <span>{shipment.carrier}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Customer ID:</span>
                                      <span>{shipment.customerId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Last Updated:</span>
                                      <span>{formatDate(shipment.lastUpdated)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Current Status */}
                                <div>
                                  <h3 className="text-sm font-semibold mb-3">Current Status</h3>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Status:</span>
                                      <Badge 
                                        variant="outline"
                                        className={cn("bg-opacity-20", shipmentStatuses[shipment.status as keyof typeof shipmentStatuses].color)}
                                      >
                                        {shipmentStatuses[shipment.status as keyof typeof shipmentStatuses].label}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Current Location:</span>
                                      <span>{shipment.currentLocation}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Est. Delivery:</span>
                                      <span>{formatDate(shipment.estimatedDelivery)}</span>
                                    </div>
                                    <div className="mt-2">
                                      <span className="text-muted-foreground">Progress:</span>
                                      <div className="mt-1">
                                        <Progress 
                                          value={shipment.progress} 
                                          className="h-2.5"
                                          indicatorClassName={cn(
                                            shipment.status === "delayed" && "bg-destructive",
                                            shipment.status === "delivered" && "bg-green-500"
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Delivery Information */}
                                <div>
                                  <h3 className="text-sm font-semibold mb-3">Delivery Information</h3>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Delivery Address:</span>
                                      <div className="mt-1">{shipment.deliveryAddress}</div>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Order ID:</span>
                                      <span>{shipment.orderId}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Tracking History */}
                              <div>
                                <h3 className="text-sm font-semibold mb-3">Tracking History</h3>
                                <div className="space-y-4">
                                  {shipment.events.map((event, idx) => (
                                    <div key={idx} className="flex">
                                      <div className="mr-4 flex flex-col items-center">
                                        <div className={cn(
                                          "rounded-full p-1",
                                          idx === 0 
                                            ? "bg-green-500 text-white" 
                                            : "bg-muted"
                                        )}>
                                          {idx === 0 ? (
                                            <Check className="h-3 w-3" />
                                          ) : (
                                            <div className="h-3 w-3" />
                                          )}
                                        </div>
                                        {idx < shipment.events.length - 1 && (
                                          <div className="h-full w-0.5 bg-muted mt-1" />
                                        )}
                                      </div>
                                      <div className="pb-4">
                                        <div className="flex justify-between">
                                          <div className="font-medium">{event.status}</div>
                                          <div className="text-muted-foreground text-sm">
                                            {formatDate(event.timestamp)}
                                          </div>
                                        </div>
                                        <div className="text-sm mt-1">{event.description}</div>
                                        <div className="text-sm text-muted-foreground">{event.location}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="mt-6 flex justify-end">
                                <Button 
                                  variant="outline" 
                                  onClick={() => toggleShipmentExpansion(shipment.id)}
                                >
                                  Close Details
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default WarehouseShipmentPage;
