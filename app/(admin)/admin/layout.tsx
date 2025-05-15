import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'SUPERADMIN') {
    redirect('/');
  }
  
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="pl-64">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}