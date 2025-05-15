'use client';

import { Product } from '@prisma/client';
import { ProductCard } from '@/components/shop/product-card';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
}

export function ProductGrid({ products, currentPage, totalPages }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground mt-2">
          Try changing your filters, or check back later for new arrivals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            &lt;
          </Button>
          <span className="flex h-10 items-center px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            &gt;
          </Button>
        </div>
      )}
    </div>
  );
}