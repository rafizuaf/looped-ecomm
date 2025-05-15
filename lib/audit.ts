import { db } from '@/lib/db';

type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';
type AuditEntity = 'USER' | 'PRODUCT' | 'ORDER';

export async function createAuditLog({
  action,
  entity,
  entityId,
  performedBy,
}: {
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  performedBy: string;
}) {
  try {
    await db.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        performedBy,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log', error);
  }
}