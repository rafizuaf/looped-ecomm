import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 5;
  const action = searchParams.get('action');
  const entity = searchParams.get('entity');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    // Build where clause based on filters
    const where: any = {};
    
    if (action) {
      where.action = action;
    }
    
    if (entity) {
      where.entity = entity;
    }
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    // Get total count with filters
    const total = await db.auditLog.count({ where });

    // Get paginated results with filters
    const logs = await db.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ logs, total });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
} 