
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

type Message = {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  timestamp: string;
  status: "new" | "pending" | "resolved";
};

const SupportMessagesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("new");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState<string>("");

  // Mock data for messages
  const mockMessages: Record<string, Message[]> = {
    new: [
      {
        id: "msg1",
        customerName: "Alice Johnson",
        customerEmail: "alice@example.com",
        subject: "Order #12345 Missing Items",
        content: "I received my order today but two items were missing from the package. Can you help?",
        timestamp: "2023-07-10T14:30:00",
        status: "new",
      },
      {
        id: "msg2",
        customerName: "Bob Smith",
        customerEmail: "bob@example.com",
        subject: "Question about product warranty",
        content: "I'd like to know more details about the warranty for the laptop I purchased last week.",
        timestamp: "2023-07-10T11:15:00",
        status: "new",
      },
    ],
    pending: [
      {
        id: "msg3",
        customerName: "Carol Wilson",
        customerEmail: "carol@example.com",
        subject: "Return request for Order #54321",
        content: "I need to return an item that doesn't fit. I've already filled out the return form.",
        timestamp: "2023-07-09T16:45:00",
        status: "pending",
      },
    ],
    resolved: [
      {
        id: "msg4",
        customerName: "David Brown",
        customerEmail: "david@example.com",
        subject: "Thank you for resolving my issue",
        content: "Just wanted to say thanks for helping me with my recent order issue. Great customer service!",
        timestamp: "2023-07-08T09:20:00",
        status: "resolved",
      },
    ],
  };

  const filteredMessages = mockMessages[activeTab].filter(
    (message) =>
      message.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedMessage(null);
    setReplyText("");
  };

  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;

    toast({
      title: "Reply sent",
      description: `Reply sent to ${selectedMessage.customerName}`,
    });

    setReplyText("");
    // In a real app, you would update the message status here
  };

  const handleStatusChange = (newStatus: "new" | "pending" | "resolved") => {
    if (!selectedMessage) return;

    toast({
      title: "Status updated",
      description: `Message marked as ${newStatus}`,
    });

    // In a real app, you would update the message status here
  };

  return (
    <DashboardLayout role="support">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Messages</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              New: {mockMessages.new.length}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Pending: {mockMessages.pending.length}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Resolved: {mockMessages.resolved.length}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle>Message List</CardTitle>
              <div className="mt-2">
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Tabs defaultValue="new" value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-3 mt-3">
                  <TabsTrigger value="new">New</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-md cursor-pointer hover:bg-muted ${
                        selectedMessage?.id === message.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handleMessageSelect(message)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{message.customerName}</span>
                        <Badge variant={message.status === "new" ? "default" : message.status === "pending" ? "secondary" : "outline"}>
                          {message.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{message.subject}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No messages found</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>
                {selectedMessage ? "Message Details" : "Select a message to view details"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMessage ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center">
                            {selectedMessage.customerName.charAt(0)}
                          </div>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedMessage.customerName}</h3>
                          <p className="text-sm text-muted-foreground">{selectedMessage.customerEmail}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(selectedMessage.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                    <div className="mt-4 whitespace-pre-wrap">{selectedMessage.content}</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Reply</h3>
                    <textarea
                      className="min-h-[120px] w-full rounded-md border border-input p-3 text-sm"
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={selectedMessage.status === "new" ? "default" : "outline"}
                          onClick={() => handleStatusChange("new")}
                        >
                          Mark as New
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedMessage.status === "pending" ? "default" : "outline"}
                          onClick={() => handleStatusChange("pending")}
                        >
                          Mark as Pending
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedMessage.status === "resolved" ? "default" : "outline"}
                          onClick={() => handleStatusChange("resolved")}
                        >
                          Mark as Resolved
                        </Button>
                      </div>
                      <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Select a message from the list to view its details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportMessagesPage;
