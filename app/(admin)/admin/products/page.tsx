import Link from 'next/link';
import { db } from '@/lib/db';
import { excludeDeleted } from '@/lib/db';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductsDataTable } from '@/components/admin/products/products-data-table';

export default async function ProductsPage() {
  const products = await db.product.findMany(
    excludeDeleted({
      orderBy: { createdAt: 'desc' },
    })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your products
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      
      <ProductsDataTable data={products} />
    </div>
  );
}