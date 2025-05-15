import Link from 'next/link';
import { Product } from '@prisma/client';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden">
          {product.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {product.description || 'No description available'}
          </p>
          <div className="mt-auto pt-4">
            <p className="font-bold">${(product.price / 100).toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}