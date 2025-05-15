'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, we would fetch cart items from API
  // For this demo, we'll use dummy data
  useEffect(() => {
    // Simulate loading cart items
    const timer = setTimeout(() => {
      // This is just dummy data - in a real app we'd load from the API
      setCartItems([
        {
          id: '1',
          productId: '1',
          name: 'Vintage Denim Jacket',
          price: 4999,
          quantity: 1,
          image: 'https://images.pexels.com/photos/1482414/pexels-photo-1482414.jpeg',
        },
        {
          id: '2',
          productId: '2',
          name: 'Retro Wool Sweater',
          price: 3499,
          quantity: 1,
          image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
        },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success('Item removed from cart');
  };
  
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleCheckout = async () => {
    if (!session) {
      router.push('/sign-in');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // In a real app, this would create an order
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-10">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-muted-foreground">
            Loading your cart...
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-10">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={() => router.push('/products')}>Shop Now</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({totalItems})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3>
                        <a href={`/products/${item.productId}`}>{item.name}</a>
                      </h3>
                      <p className="ml-4">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Checkout'}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <AlertCircle className="mr-2 h-4 w-4" />
            <p>This is a demo checkout. No real payments will be processed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}