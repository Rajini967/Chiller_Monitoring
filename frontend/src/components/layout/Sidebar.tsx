import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ClipboardList,
  Beaker,
  Wind,
  Wrench,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Hammer,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const roleLabels: Record<string, string> = {
  operator: 'Operator',
  supervisor: 'Supervisor',
  customer: 'Client',
  super_admin: 'Super Admin',
};

const roleColors: Record<string, 'default' | 'accent' | 'warning' | 'success'> = {
  operator: 'default',
  supervisor: 'accent',
  customer: 'warning',
  super_admin: 'success',
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['operator', 'supervisor', 'customer', 'super_admin'] },
    { path: '/logbooks', icon: BookOpen, label: 'Logbooks', roles: ['operator', 'supervisor', 'super_admin'] },
    { path: '/logbook-builder', icon: Hammer, label: 'Logbook Builder', roles: ['super_admin'] },
    { path: '/utility-logs', icon: ClipboardList, label: 'Utility Logs', roles: ['operator', 'supervisor', 'super_admin'] },
    { path: '/chemical-prep', icon: Beaker, label: 'Chemical Prep', roles: ['operator', 'supervisor', 'super_admin'] },
    { path: '/air-validation', icon: Wind, label: 'Air Validation', roles: ['operator', 'supervisor', 'super_admin'] },
    { path: '/instruments', icon: Wrench, label: 'Instruments', roles: ['supervisor', 'super_admin'] },
    { path: '/reports', icon: FileText, label: 'Reports', roles: ['supervisor', 'customer', 'super_admin'] },
    { path: '/users', icon: Users, label: 'User Management', roles: ['super_admin'] },
    { path: '/settings', icon: Settings, label: 'Settings', roles: ['super_admin'] },
  ];

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen sidebar-gradient transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">LogBook</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User Info */}
      {user && !collapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <Badge variant={roleColors[user.role]} className="mt-1 text-xs">
                {roleLabels[user.role]}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
