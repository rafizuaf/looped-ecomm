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
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive &&
          'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700 border-r-2 border-slate-700'
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
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
      icon: <LayoutDashboard className="h-4 w-4" />,
      title: 'Dashboard',
    },
    {
      href: '/admin/products',
      icon: <Package className="h-4 w-4" />,
      title: 'Products',
    },
    {
      href: '/admin/orders',
      icon: <ShoppingCart className="h-4 w-4" />,
      title: 'Orders',
    },
    {
      href: '/admin/users',
      icon: <Users className="h-4 w-4" />,
      title: 'Users',
    },
    {
      href: '/admin/analytics',
      icon: <BarChart className="h-4 w-4" />,
      title: 'Analytics',
    },
    {
      href: '/admin/settings',
      icon: <Settings className="h-4 w-4" />,
      title: 'Settings',
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white border-r shadow-sm w-64">
      <div className="p-6">
        <Link href="/">
          <h1 className="font-bold text-xl">LOOPED</h1>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </Link>
      </div>
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
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </div>
  );
}