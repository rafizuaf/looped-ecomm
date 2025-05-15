'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const formattedPrice = (product.price / 100).toFixed(2);
  const inStock = product.stock > 0;
  
  const addToCart = async () => {
    setIsLoading(true);
    
    try {
      if (!session) {
        router.push('/sign-in');
        return;
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: parseInt(quantity, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      toast.success('Added to cart');
      router.refresh();
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <p className="text-3xl font-bold mt-2">${formattedPrice}</p>
      </div>
      
      {product.description && (
        <div className="prose prose-sm">
          <p>{product.description}</p>
        </div>
      )}
      
      <div className="border-t pt-4">
        <p className="flex items-center justify-between text-sm">
          <span className="font-medium">Category:</span>
          <span>{product.category || 'Uncategorized'}</span>
        </p>
        <p className="flex items-center justify-between text-sm mt-2">
          <span className="font-medium">Availability:</span>
          <span>{inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
        </p>
      </div>
      
      {inStock && (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantity:</span>
            <Select 
              value={quantity} 
              onValueChange={setQuantity}
              disabled={!inStock || isLoading}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={addToCart} 
            disabled={!inStock || isLoading} 
            className="w-full"
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      )}
      
      {!inStock && (
        <Button disabled className="w-full">Out of Stock</Button>
      )}
    </div>
  );
}