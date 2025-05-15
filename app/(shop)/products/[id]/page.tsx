/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProductGallery } from '@/components/shop/product-gallery';
import { ProductInfo } from '@/components/shop/product-info';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: {
      id: params.id,
      deletedAt: null,
    },
  });

  if (!product) {
    notFound();
  }

  // Get 4 related products from the same category, excluding the current product
  const relatedProducts = await db.product.findMany({
    where: {
      id: { not: product.id },
      category: product.category,
      deletedAt: null,
    },
    take: 4,
  });

  return (
    <div className="container mx-auto py-12 px-4 md:px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="rounded-lg overflow-hidden border">
                <a href={`/products/${relatedProduct.id}`} className="group">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={relatedProduct.images[0] || ''}
                      alt={relatedProduct.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">{relatedProduct.name}</h3>
                    <p className="mt-2 font-bold">
                      ${(relatedProduct.price / 100).toFixed(2)}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}