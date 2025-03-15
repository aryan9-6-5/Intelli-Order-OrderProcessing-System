import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { MessageSquare, Search, ArrowRight, Filter } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SupportMessagesPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock messages data
  const messages = [
    {
      id: "MSG-3491",
      customer: "John Smith",
      email: "john.smith@example.com",
      subject: "Where is my order?",
      date: "2023-10-15T14:23:00",
      status: "new",
      avatar: "JS"
    },
    {
      id: "MSG-3492",
      customer: "Sarah Johnson",
      email: "sarah.j@example.com",
      subject: "Item damaged on arrival",
      date: "2023-10-14T09:15:00",
      status: "pending",
      avatar: "SJ"
    },
    {
      id: "MSG-3493",
      customer: "Michael Brown",
      email: "michael.b@example.com",
      subject: "Request for refund",
      date: "2023-10-13T16:45:00",
      status: "pending",
      avatar: "MB"
    },
    {
      id: "MSG-3494",
      customer: "Emma Wilson",
      email: "emma.w@example.com",
      subject: "Wrong item received",
      date: "2023-10-12T11:30:00",
      status: "resolved",
      avatar: "EW"
    },
    {
      id: "MSG-3495",
      customer: "Robert Garcia",
      email: "robert.g@example.com",
      subject: "Questions about shipping",
      date: "2023-10-11T15:20:00",
      status: "resolved",
      avatar: "RG"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search initiated",
      description: `Searching for: ${searchQuery}`,
    });
  };

  const handleViewMessage = (id: string) => {
    navigate(`/support/messages/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Helmet>
        <title>Customer Messages - Support Portal</title>
      </Helmet>
      
      <DashboardLayout role="support">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Messages</h1>
            <p className="text-muted-foreground mt-1">
              View and respond to customer inquiries and support tickets.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by ID, customer name, or content..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button onClick={() => toast({ 
                title: "Feature in development",
                description: "The compose message feature is coming soon."
              })}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Compose
              </Button>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Subject</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{message.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-medium">
                            {message.avatar}
                          </div>
                          <div>
                            <div className="font-medium">{message.customer}</div>
                            <div className="text-sm text-muted-foreground">{message.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{message.subject}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatDate(message.date)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(message.status)} capitalize`}>
                          {message.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewMessage(message.id)}
                        >
                          View <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SupportMessagesPage;
