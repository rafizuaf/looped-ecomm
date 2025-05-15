import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProductForm } from '@/components/admin/products/product-form';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} />;
}