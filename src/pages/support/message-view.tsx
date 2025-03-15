
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ArrowLeft, Send, PaperclipIcon, MoreHorizontal } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

const MessageView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reply, setReply] = useState("");

  // Mock message data - would come from API in a real app
  const message = {
    id: id || "MSG-3491",
    customer: "John Smith",
    email: "john.smith@example.com",
    subject: "Where is my order?",
    date: "2023-10-15T14:23:00",
    status: "new",
    avatar: "JS",
    messages: [
      {
        id: 1,
        sender: "customer",
        content: "Hello, I placed an order 3 days ago (Order #45678) and I still haven't received any shipping confirmation. Can you tell me the status of my order?",
        timestamp: "2023-10-15T14:23:00"
      },
      {
        id: 2,
        sender: "system",
        content: "This ticket has been assigned to Support Agent.",
        timestamp: "2023-10-15T14:24:00"
      }
    ]
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    
    // In a real app, this would send to the API
    toast({
      title: "Reply sent",
      description: "Your reply has been sent to the customer."
    });
    
    setReply("");
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

  return (
    <>
      <Helmet>
        <title>Customer Message - Support Portal</title>
      </Helmet>
      
      <DashboardLayout role="support">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/support/messages')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Button>
            <h1 className="text-2xl font-bold tracking-tight ml-2">
              Message {message.id}
            </h1>
            <Badge className="ml-2 bg-blue-100 text-blue-700 capitalize">
              {message.status}
            </Badge>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{message.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{message.customer}</h2>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-1">{message.subject}</h3>
              <p className="text-sm text-muted-foreground">
                Received: {formatDate(message.date)}
              </p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4 mb-6">
              {message.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-3/4 p-3 rounded-lg ${msg.sender === 'customer' ? 'bg-muted/50' : msg.sender === 'system' ? 'bg-yellow-50 text-yellow-700' : 'bg-accent text-accent-foreground'}`}>
                    <p>{msg.content}</p>
                    <div className="text-xs mt-1 text-muted-foreground">
                      {formatDate(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <Input
                placeholder="Type your reply here..."
                className="pr-28"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-8" onClick={handleSendReply}>
                  <Send className="h-4 w-4 mr-1" /> Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default MessageView;
