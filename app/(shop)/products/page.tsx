import { db } from '@/lib/db';
import { excludeDeleted } from '@/lib/db';
import { ProductGrid } from '@/components/shop/product-grid';
import { ProductsFilter } from '@/components/shop/products-filter';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;
  const skip = (page - 1) * pageSize;
  
  const category = searchParams.category;
  const sort = searchParams.sort || 'newest';

  // Build the query
  const where = {
    ...(category ? { category } : {}),
    deletedAt: null,
  };

  // Determine sorting
  let orderBy = {};
  switch (sort) {
    case 'price-low':
      orderBy = { price: 'asc' };
      break;
    case 'price-high':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  // Query products
  const products = await db.product.findMany({
    where,
    orderBy,
    skip,
    take: pageSize,
  });

  // Count total products for pagination
  const totalProducts = await db.product.count({ where });
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Get all categories for filter
  const categories = await db.product.findMany({
    where: { deletedAt: null },
    select: { category: true },
    distinct: ['category'],
  });
  
  const uniqueCategories = categories
    .map((c) => c.category)
    .filter((c): c is string => !!c);

  return (
    <div className="container mx-auto py-12 px-4 md:px-10">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <ProductsFilter 
            categories={uniqueCategories} 
            selectedCategory={category}
            selectedSort={sort}
          />
        </div>
        
        <div className="flex-1">
          <ProductGrid 
            products={products} 
            currentPage={page} 
            totalPages={totalPages} 
          />
        </div>
      </div>
    </div>
  );
}