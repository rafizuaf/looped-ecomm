'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminSidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
}

function AdminSidebarItem({
  href,
  icon,
  title,
  isActive,
}: AdminSidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-medium px-6 py-3 transition-all hover:text-slate-900 hover:bg-slate-100/50',
        isActive &&
          'text-slate-900 bg-slate-100/50 hover:bg-slate-100/50 hover:text-slate-900 border-r-2 border-slate-900'
      )}
    >
      <div className="flex items-center gap-x-3">
        {icon}
        {title}
      </div>
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  
  const routes = [
    {
      href: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
      title: 'Dashboard',
    },
    {
      href: '/admin/products',
      icon: <Package className="h-5 w-5" />,
      title: 'Products',
    },
    {
      href: '/admin/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
      title: 'Orders',
    },
    {
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      title: 'Users',
    },
    {
      href: '/admin/analytics',
      icon: <BarChart className="h-5 w-5" />,
      title: 'Analytics',
    },
    {
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      title: 'Settings',
    },
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <Link href="/" className="flex flex-col gap-1">
            <h1 className="font-bold text-2xl tracking-tight">LOOPED</h1>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex flex-col w-full">
            {routes.map((route) => (
              <AdminSidebarItem
                key={route.href}
                href={route.href}
                icon={route.icon}
                title={route.title}
                isActive={pathname === route.href}
              />
            ))}
          </div>
        </div>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}