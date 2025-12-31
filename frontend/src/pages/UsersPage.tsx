import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Users, Building2, Shield, Mail, User, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'customer' | 'super_admin';
  site: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

const mockUsers: UserData[] = [
  { id: 'usr-001', name: 'James Wilson', email: 'operator@logbook.io', role: 'operator', site: 'Site Alpha', status: 'active', createdAt: new Date('2024-01-15') },
  { id: 'usr-002', name: 'Sarah Chen', email: 'supervisor@logbook.io', role: 'supervisor', site: 'Site Alpha', status: 'active', createdAt: new Date('2024-01-10') },
  { id: 'usr-003', name: 'Michael Foster', email: 'customer@logbook.io', role: 'customer', site: 'Site Alpha', status: 'active', createdAt: new Date('2024-02-01') },
  { id: 'usr-004', name: 'Emily Rodriguez', email: 'admin@logbook.io', role: 'super_admin', site: 'All Sites', status: 'active', createdAt: new Date('2023-12-01') },
  { id: 'usr-005', name: 'David Park', email: 'david.p@company.com', role: 'operator', site: 'Site Beta', status: 'inactive', createdAt: new Date('2024-03-15') },
];

const roleLabels: Record<string, string> = {
  operator: 'Operator',
  supervisor: 'Supervisor',
  customer: 'Client',
  super_admin: 'Super Admin',
};

const roleVariants: Record<string, 'default' | 'accent' | 'warning' | 'success'> = {
  operator: 'default',
  supervisor: 'accent',
  customer: 'warning',
  super_admin: 'success',
};

const sites = ['Site Alpha', 'Site Beta', 'Site Gamma', 'All Sites'];

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    site: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: UserData = {
      id: `usr-${String(users.length + 1).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as UserData['role'],
      site: formData.site,
      status: 'active',
      createdAt: new Date(),
    };

    setUsers([newUser, ...users]);
    setIsDialogOpen(false);
    setFormData({ name: '', email: '', role: '', site: '' });
    toast.success('User created successfully');
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User removed');
  };

  return (
    <div className="min-h-screen">
      <Header
        title="User Management"
        subtitle="Manage system users and access control"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-card">
            <p className="data-label">Total Users</p>
            <p className="reading-display text-2xl">{users.length}</p>
          </div>
          <div className="metric-card">
            <p className="data-label">Operators</p>
            <p className="reading-display text-2xl">{users.filter(u => u.role === 'operator').length}</p>
          </div>
          <div className="metric-card">
            <p className="data-label">Supervisors</p>
            <p className="reading-display text-2xl">{users.filter(u => u.role === 'supervisor').length}</p>
          </div>
          <div className="metric-card">
            <p className="data-label">Clients</p>
            <p className="reading-display text-2xl">{users.filter(u => u.role === 'customer').length}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="success">{users.filter(u => u.status === 'active').length} Active</Badge>
            <Badge variant="secondary">{users.filter(u => u.status === 'inactive').length} Inactive</Badge>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Create New User
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setFormData({ ...formData, role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="customer">Client</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Assigned Site
                  </Label>
                  <Select
                    value={formData.site}
                    onValueChange={(v) => setFormData({ ...formData, site: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="accent">
                    Create User
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Site</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-accent">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={roleVariants[user.role]}>{roleLabels[user.role]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">{user.site}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
