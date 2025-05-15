import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { excludeDeleted } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    const product = await db.product.findUnique(
      excludeDeleted({
        where: { id: params.id },
      })
    );

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}