/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Product } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UploadButton } from '@/components/ui/upload-button';
import { Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProductFormProps {
  initialData: Product | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: 'Price must be positive' }),
  cost: z.coerce.number().positive({ message: 'Cost must be positive' }),
  stock: z.coerce.number().int().nonnegative({ message: 'Stock cannot be negative' }),
  category: z.string().optional(),
  images: z.array(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const title = initialData ? 'Edit Product' : 'Create Product';
  const action = initialData ? 'Save changes' : 'Create';
  const toastMessage = initialData ? 'Product updated' : 'Product created';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || undefined,
      price: initialData.price / 100,
      cost: initialData.cost / 100,
      stock: initialData.stock,
      category: initialData.category || undefined,
      images: initialData.images,
    } : {
      name: '',
      description: '',
      price: 0,
      cost: 0,
      stock: 0,
      category: '',
      images: [],
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);
      
      // Convert price and cost to cents for storage
      const transformedData = {
        ...data,
        price: Math.round(data.price * 100),
        cost: Math.round(data.cost * 100),
      };
      
      if (initialData) {
        // Update existing product
        await fetch(`/api/admin/products/${initialData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedData),
        });
      } else {
        // Create new product
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transformedData),
        });
      }
      
      router.refresh();
      router.push('/admin/products');
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);
      
      await fetch(`/api/admin/products/${initialData?.id}`, {
        method: 'DELETE',
      });
      
      router.refresh();
      router.push('/admin/products');
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    const currentImages = form.getValues('images');
    form.setValue('images', [...currentImages, imageUrl]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    form.setValue(
      'images',
      currentImages.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">
          {initialData ? 'Edit your product details' : 'Add a new product to your store'}
        </p>
      </div>
      
      <Separator />
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                disabled={isLoading}
                placeholder="Product name"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                disabled={isLoading}
                placeholder="Product description"
                {...form.register('description')}
                className="resize-none min-h-[120px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                disabled={isLoading}
                placeholder="Category"
                {...form.register('category')}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                  placeholder="0.00"
                  {...form.register('price')}
                />
                {form.formState.errors.price && (
                  <p className="text-destructive text-sm">{form.formState.errors.price.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                  placeholder="0.00"
                  {...form.register('cost')}
                />
                {form.formState.errors.cost && (
                  <p className="text-destructive text-sm">{form.formState.errors.cost.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  disabled={isLoading}
                  placeholder="0"
                  {...form.register('stock')}
                />
                {form.formState.errors.stock && (
                  <p className="text-destructive text-sm">{form.formState.errors.stock.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label>Product Images</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {form.watch('images').map((image, index) => (
                  <div key={index} className="relative group rounded-md overflow-hidden">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {form.watch('images').length < 4 && (
                  <Card className="flex items-center justify-center h-32 border-dashed">
                    <CardContent className="p-4">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.length) {
                            handleImageUpload(res[0].url);
                            toast.success('Image uploaded');
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed: ${error.message}`);
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
              {form.watch('images').length === 0 && (
                <p className="text-muted-foreground text-sm mt-2">
                  Add at least one image for your product
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-x-2">
          <Button
            type="submit"
            disabled={isLoading}
          >
            {action}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          
          {initialData && (
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={onDelete}
              className="ml-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}