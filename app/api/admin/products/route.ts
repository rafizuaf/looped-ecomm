import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPERADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { name, description, price, cost, stock, category, images } = body;

    // Create product
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        cost,
        stock,
        category,
        images,
      },
    });

    // Create audit log
    await createAuditLog({
      action: 'CREATE',
      entity: 'PRODUCT',
      entityId: product.id,
      performedBy: session.user.id,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}