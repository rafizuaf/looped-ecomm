import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPERADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, cost, stock, category, images } = body;

    // Update product
    const product = await db.product.update({
      where: {
        id: params.id,
      },
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
      action: 'UPDATE',
      entity: 'Product',
      entityId: product.id,
      performedBy: session.user.id,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'SUPERADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Soft delete - set deletedAt
    const product = await db.product.update({
      where: {
        id: params.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    // Create audit log
    await createAuditLog({
      action: 'DELETE',
      entity: 'Product',
      entityId: product.id,
      performedBy: session.user.id,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}