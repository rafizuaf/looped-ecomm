import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { excludeDeleted } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

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

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Get products
    const products = await db.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    });

    // Count total products for pagination
    const totalProducts = await db.product.count({ where });
    const totalPages = Math.ceil(totalProducts / pageSize);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
      },
    });
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}