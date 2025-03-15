
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  MessagesSquare, 
  Search, 
  Filter, 
  User, 
  Clock, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Send 
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for customer messages
const mockCustomerMessages = [
  {
    id: "CM-1001",
    customer: {
      id: "CUST-5023",
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: ""
    },
    subject: "Order #12345 Delivery Problem",
    preview: "I haven't received my order yet and it's been 5 days since the expected delivery date...",
    message: "I haven't received my order yet and it's been 5 days since the expected delivery date. The tracking information hasn't updated in over a week. Please help me locate my package or provide a refund. Order number is #12345. Thank you.",
    status: "open",
    priority: "high",
    category: "shipping",
    dateReceived: "2023-08-12T14:30:00",
    lastUpdated: "2023-08-12T14:30:00",
    assignee: null,
    history: [
      {
        type: "received",
        date: "2023-08-12T14:30:00",
        content: "Message received from customer"
      }
    ]
  },
  {
    id: "CM-1002",
    customer: {
      id: "CUST-6104",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: ""
    },
    subject: "Refund Request for Damaged Item",
    preview: "I received my order yesterday but the product was damaged in transit...",
    message: "I received my order yesterday but the product was damaged in transit. The packaging was intact but the item inside has a large crack across the screen. I've attached photos of the damage. Please let me know how to proceed with a refund or replacement. My order number is #23456.",
    status: "open",
    priority: "medium",
    category: "refund",
    dateReceived: "2023-08-13T09:15:00",
    lastUpdated: "2023-08-13T10:30:00",
    assignee: "Jane Cooper",
    history: [
      {
        type: "received",
        date: "2023-08-13T09:15:00",
        content: "Message received from customer"
      },
      {
        type: "assigned",
        date: "2023-08-13T10:30:00",
        content: "Ticket assigned to Jane Cooper"
      }
    ]
  },
  {
    id: "CM-1003",
    customer: {
      id: "CUST-3217",
      name: "Michael Chen",
      email: "michael.c@example.com",
      avatar: ""
    },
    subject: "Question about Product Compatibility",
    preview: "I recently purchased your wireless headphones and I'm wondering if they're compatible with...",
    message: "I recently purchased your wireless headphones and I'm wondering if they're compatible with my gaming console. The product page didn't specifically mention console compatibility. Could you please confirm if they will work with a PlayStation 5? Thanks!",
    status: "in-progress",
    priority: "low",
    category: "product",
    dateReceived: "2023-08-11T16:45:00",
    lastUpdated: "2023-08-13T11:20:00",
    assignee: "Robert Fox",
    history: [
      {
        type: "received",
        date: "2023-08-11T16:45:00",
        content: "Message received from customer"
      },
      {
        type: "assigned",
        date: "2023-08-12T09:30:00",
        content: "Ticket assigned to Robert Fox"
      },
      {
        type: "update",
        date: "2023-08-13T11:20:00",
        content: "Checking with product team for compatibility details"
      }
    ]
  },
  {
    id: "CM-1004",
    customer: {
      id: "CUST-9875",
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      avatar: ""
    },
    subject: "Order Cancellation Request",
    preview: "I would like to cancel my recent order #34567 as I accidentally ordered the wrong item...",
    message: "I would like to cancel my recent order #34567 as I accidentally ordered the wrong item. I placed the order about an hour ago, so I hope it hasn't been processed yet. Please confirm the cancellation and refund to my original payment method. Thank you for your assistance.",
    status: "closed",
    priority: "medium",
    category: "order",
    dateReceived: "2023-08-10T13:10:00",
    lastUpdated: "2023-08-10T14:25:00",
    assignee: "Jane Cooper",
    history: [
      {
        type: "received",
        date: "2023-08-10T13:10:00",
        content: "Message received from customer"
      },
      {
        type: "assigned",
        date: "2023-08-10T13:30:00",
        content: "Ticket assigned to Jane Cooper"
      },
      {
        type: "response",
        date: "2023-08-10T14:00:00",
        content: "Order cancellation processed and customer notified"
      },
      {
        type: "closed",
        date: "2023-08-10T14:25:00",
        content: "Ticket closed - cancellation completed successfully"
      }
    ]
  },
  {
    id: "CM-1005",
    customer: {
      id: "CUST-4362",
      name: "David Wilson",
      email: "david.w@example.com",
      avatar: ""
    },
    subject: "Website Login Issues",
    preview: "I'm having trouble logging into my account on your website. I've tried resetting my password...",
    message: "I'm having trouble logging into my account on your website. I've tried resetting my password multiple times but I'm not receiving the password reset email. I've checked my spam folder as well. My email address is david.w@example.com. Could you please help me regain access to my account?",
    status: "in-progress",
    priority: "high",
    category: "technical",
    dateReceived: "2023-08-13T08:50:00",
    lastUpdated: "2023-08-13T09:30:00",
    assignee: "Robert Fox",
    history: [
      {
        type: "received",
        date: "2023-08-13T08:50:00",
        content: "Message received from customer"
      },
      {
        type: "assigned",
        date: "2023-08-13T09:15:00",
        content: "Ticket assigned to Robert Fox"
      },
      {
        type: "update",
        date: "2023-08-13T09:30:00",
        content: "Investigating login system for issues"
      }
    ]
  }
];

// Status definitions
const messageStatuses = {
  "open": { label: "Open", icon: <Clock className="h-4 w-4" />, color: "bg-amber-500" },
  "in-progress": { label: "In Progress", icon: <Clock3 className="h-4 w-4" />, color: "bg-blue-500" },
  "closed": { label: "Closed", icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-green-500" },
  "spam": { label: "Spam", icon: <XCircle className="h-4 w-4" />, color: "bg-destructive" }
};

// Priority definitions
const priorities = {
  "high": { label: "High", color: "text-destructive font-medium" },
  "medium": { label: "Medium", color: "text-amber-500" },
  "low": { label: "Low", color: "text-muted-foreground" }
};

const SupportMessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [responseText, setResponseText] = useState("");
  const [currentTab, setCurrentTab] = useState("all");

  // Filter messages based on search and filters
  const filteredMessages = mockCustomerMessages.filter(message => {
    // Search filter
    const searchMatch = 
      searchQuery === "" || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const statusMatch = filterStatus === null || message.status === filterStatus;
    
    // Tab filter
    const tabMatch = 
      currentTab === "all" || 
      (currentTab === "open" && message.status === "open") ||
      (currentTab === "in-progress" && message.status === "in-progress") ||
      (currentTab === "closed" && message.status === "closed");
    
    return searchMatch && statusMatch && tabMatch;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Time from now
  const timeFromNow = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'Just now';
  };

  // Handle message click
  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    setResponseText("");
  };

  // Send response
  const handleSendResponse = () => {
    if (!responseText.trim()) return;
    
    toast.success("Response sent successfully", {
      description: `Your response to ${selectedMessage.customer.name} has been sent.`
    });
    
    // In a real app, this would update the message in the database
    console.log(`Response sent to ${selectedMessage.id}:`, responseText);
    setResponseText("");
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Helmet>
        <title>Customer Messages - IntelliOrder</title>
      </Helmet>
      
      <DashboardLayout role="support">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Messages</h1>
            <p className="text-muted-foreground mt-1">
              Manage and respond to customer inquiries and support requests
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Panel - Message List */}
            <div className="lg:w-2/3 space-y-6">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                  {Object.keys(messageStatuses).map(status => (
                    <Button 
                      key={status}
                      variant={filterStatus === status ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setFilterStatus(filterStatus === status ? null : status)}
                      className="whitespace-nowrap"
                    >
                      {messageStatuses[status as keyof typeof messageStatuses].icon}
                      <span className="ml-1">{messageStatuses[status as keyof typeof messageStatuses].label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* Message List */}
              <div className="space-y-3">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No messages found matching your search criteria.
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div 
                      key={message.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent/20",
                        selectedMessage?.id === message.id ? "bg-accent/20 border-accent" : "bg-muted/10"
                      )}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary-foreground">
                              {getInitials(message.customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{message.customer.name}</div>
                            <div className="text-xs text-muted-foreground">{message.customer.email}</div>
                          </div>
                        </div>
                        <div className="text-xs text-right">
                          <div>{timeFromNow(message.lastUpdated)}</div>
                          <div className={priorities[message.priority as keyof typeof priorities].color}>
                            {priorities[message.priority as keyof typeof priorities].label} Priority
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium line-clamp-1">{message.subject}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {message.preview}
                          </div>
                        </div>
                        <Badge 
                          variant="outline"
                          className="ml-2 whitespace-nowrap"
                        >
                          <span className={`mr-1 inline-block w-2 h-2 rounded-full ${messageStatuses[message.status as keyof typeof messageStatuses].color}`}></span>
                          {messageStatuses[message.status as keyof typeof messageStatuses].label}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Right Panel - Message Details */}
            <div className="lg:w-1/3 glass-card rounded-xl">
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  {/* Message Header */}
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                      <Badge 
                        variant="outline"
                        className="ml-2"
                      >
                        <span className={`mr-1 inline-block w-2 h-2 rounded-full ${messageStatuses[selectedMessage.status as keyof typeof messageStatuses].color}`}></span>
                        {messageStatuses[selectedMessage.status as keyof typeof messageStatuses].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20 text-primary-foreground">
                          {getInitials(selectedMessage.customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedMessage.customer.name}</div>
                        <div className="text-xs flex gap-2">
                          <span className="text-muted-foreground">{selectedMessage.customer.email}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{formatDate(selectedMessage.dateReceived)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Body */}
                  <div className="p-4 flex-1 overflow-auto">
                    <div className="mb-6 whitespace-pre-line">
                      {selectedMessage.message}
                    </div>
                    
                    {/* Message History */}
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1" /> Message History
                      </h3>
                      <div className="space-y-3">
                        {selectedMessage.history.map((item: any, index: number) => (
                          <div key={index} className="text-sm">
                            <div className="flex justify-between text-muted-foreground">
                              <span className="capitalize">{item.type}</span>
                              <span>{formatDate(item.date)}</span>
                            </div>
                            <div>{item.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Response Area */}
                  <div className="p-4 border-t">
                    <Textarea
                      placeholder="Type your response here..."
                      className="mb-2"
                      rows={4}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                    <div className="flex justify-between">
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={selectedMessage.status === "closed"}
                          onClick={() => {
                            toast.success(`Ticket ${selectedMessage.status === "closed" ? "reopened" : "closed"}`, {
                              description: `Ticket ${selectedMessage.id} has been ${selectedMessage.status === "closed" ? "reopened" : "closed"}.`
                            });
                          }}
                        >
                          {selectedMessage.status === "closed" ? "Reopen Ticket" : "Close Ticket"}
                        </Button>
                      </div>
                      <Button
                        className="gap-2"
                        disabled={!responseText.trim()}
                        onClick={handleSendResponse}
                      >
                        <Send className="h-4 w-4" />
                        Send Response
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 text-center text-muted-foreground">
                  <div>
                    <MessagesSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Select a message to view details and respond</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SupportMessagesPage;
