
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Search, Plus, Edit, Trash2, UserPlus, Mail, User, Shield, Briefcase, MoreHorizontal } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Mock data
const mockStaffMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex.johnson@intelliorder.com",
    role: "admin",
    department: "Management",
    status: "active",
    joined: "2022-03-15",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@intelliorder.com",
    role: "admin",
    department: "Finance",
    status: "active",
    joined: "2022-04-20",
  },
  {
    id: 3,
    name: "Michael Davis",
    email: "michael.davis@intelliorder.com",
    role: "warehouse",
    department: "Operations",
    status: "active",
    joined: "2022-05-10",
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.brown@intelliorder.com",
    role: "warehouse",
    department: "Operations",
    status: "inactive",
    joined: "2022-06-15",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@intelliorder.com",
    role: "support",
    department: "Customer Service",
    status: "active",
    joined: "2022-07-22",
  },
  {
    id: 6,
    name: "Lisa Garcia",
    email: "lisa.garcia@intelliorder.com",
    role: "support",
    department: "Customer Service",
    status: "active",
    joined: "2022-08-30",
  },
];

type StaffRole = "admin" | "warehouse" | "support" | "all";

const AdminStaffPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<StaffRole>("all");
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const { toast } = useToast();
  
  const filteredStaff = mockStaffMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = activeFilter === "all" || member.role === activeFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleAddStaff = () => {
    // In a real app, this would add the staff member to the database
    toast({
      title: "Staff member added",
      description: "The new staff member has been added successfully.",
    });
    setIsAddStaffDialogOpen(false);
  };
  
  const handleEditStaff = (staff: any) => {
    setSelectedStaff(staff);
    setIsAddStaffDialogOpen(true);
  };
  
  const handleDeleteStaff = (staff: any) => {
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    // In a real app, this would delete the staff member from the database
    toast({
      title: "Staff member removed",
      description: `${selectedStaff.name} has been removed from the system.`,
    });
    setIsDeleteDialogOpen(false);
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-primary" />;
      case "warehouse":
        return <Briefcase className="h-4 w-4 text-indigo-500" />;
      case "support":
        return <User className="h-4 w-4 text-emerald-500" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        );
      case "warehouse":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            Warehouse
          </Badge>
        );
      case "support":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center gap-1">
            <User className="h-3 w-3" />
            Support
          </Badge>
        );
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
        Inactive
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title>Staff Management - IntelliOrder Admin</title>
      </Helmet>
      
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage staff accounts and access permissions across your organization.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="w-full md:w-72">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search staff..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ToggleGroup 
                type="single" 
                value={activeFilter}
                onValueChange={(value) => {
                  if (value) setActiveFilter(value as StaffRole);
                }}
              >
                <ToggleGroupItem value="all" aria-label="All staff">All</ToggleGroupItem>
                <ToggleGroupItem value="admin" aria-label="Admin staff">Admin</ToggleGroupItem>
                <ToggleGroupItem value="warehouse" aria-label="Warehouse staff">Warehouse</ToggleGroupItem>
                <ToggleGroupItem value="support" aria-label="Support staff">Support</ToggleGroupItem>
              </ToggleGroup>
              
              <Button 
                onClick={() => {
                  setSelectedStaff(null);
                  setIsAddStaffDialogOpen(true);
                }}
                className="ml-4"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {staff.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{staff.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{staff.email}</TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>{getRoleBadge(staff.role)}</TableCell>
                      <TableCell>{getStatusBadge(staff.status)}</TableCell>
                      <TableCell>{new Date(staff.joined).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background">
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Email sent",
                                description: `An email has been sent to ${staff.name}.`,
                              });
                            }}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditStaff(staff)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteStaff(staff)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DashboardLayout>
      
      {/* Add/Edit Staff Dialog */}
      <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
            <DialogDescription>
              {selectedStaff 
                ? "Update the details for this staff member."
                : "Fill in the details to add a new staff member to the system."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                defaultValue={selectedStaff?.name || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                defaultValue={selectedStaff?.email || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="text-right text-sm font-medium">
                Department
              </label>
              <Input
                id="department"
                defaultValue={selectedStaff?.department || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Role
              </label>
              <ToggleGroup 
                type="single" 
                className="col-span-3 border rounded-md" 
                defaultValue={selectedStaff?.role || "support"}
              >
                <ToggleGroupItem value="admin" className="flex-1">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </ToggleGroupItem>
                <ToggleGroupItem value="warehouse" className="flex-1">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Warehouse
                </ToggleGroupItem>
                <ToggleGroupItem value="support" className="flex-1">
                  <User className="h-4 w-4 mr-2" />
                  Support
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Status
              </label>
              <ToggleGroup 
                type="single" 
                className="col-span-3 border rounded-md" 
                defaultValue={selectedStaff?.status || "active"}
              >
                <ToggleGroupItem value="active" className="flex-1">Active</ToggleGroupItem>
                <ToggleGroupItem value="inactive" className="flex-1">Inactive</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStaffDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>
              {selectedStaff ? "Update Staff" : "Add Staff"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Staff Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {selectedStaff?.name} from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminStaffPage;
