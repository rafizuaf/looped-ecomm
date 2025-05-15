import { db } from '@/lib/db';
import { excludeDeleted } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SalesChart } from '@/components/charts/SalesChart';
import {
  ShoppingBag,
  Users,
  DollarSign,
  Package,
} from 'lucide-react';
import { OrdersList } from '@/components/admin/OrdersList';
import { AuditLogsList } from '@/components/admin/AuditLogsList';

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { orderPage?: string; logPage?: string };
}) {
  const orderPage = Number(searchParams.orderPage) || 1;
  const logPage = Number(searchParams.logPage) || 1;
  const itemsPerPage = 5;

  // Get counts
  const productCount = await db.product.count(excludeDeleted());
  const userCount = await db.user.count(excludeDeleted());
  const orderCount = await db.order.count(excludeDeleted());

  // Get total counts for pagination
  const totalOrders = await db.order.count({
    where: { deletedAt: null }
  });

  const totalLogs = await db.auditLog.count();

  // Get latest orders with pagination
  const latestOrders = await db.order.findMany({
    where: { deletedAt: null },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: (orderPage - 1) * itemsPerPage,
    take: itemsPerPage,
  });

  // Generate some mock data for charts
  const salesData = [
    { name: 'Mon', sales: 2400 },
    { name: 'Tue', sales: 1398 },
    { name: 'Wed', sales: 9800 },
    { name: 'Thu', sales: 3908 },
    { name: 'Fri', sales: 4800 },
    { name: 'Sat', sales: 3800 },
    { name: 'Sun', sales: 4300 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance and metrics.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Items in inventory
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orderCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Orders placed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${(latestOrders.reduce((acc, order) => acc + order.total, 0) / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime sales
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <SalesChart data={salesData} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersList
                  initialPage={orderPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalOrders}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditLogsList
                  initialPage={logPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalLogs}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Detailed analytics will be available in the next update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Report generation will be available in the next update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}