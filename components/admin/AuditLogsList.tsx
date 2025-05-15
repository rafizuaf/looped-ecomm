'use client';

import { useState, useEffect } from 'react';
import { PaginationControls } from './PaginationControls';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AuditLog {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  performedBy: string;
}

interface AuditLogsListProps {
  initialPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export function AuditLogsList({ initialPage, itemsPerPage, totalItems }: AuditLogsListProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/audit-logs?page=${page}&limit=${itemsPerPage}`);
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {logs.map((log) => (
        <div key={log.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="space-y-1">
            <p className="font-medium leading-none capitalize">{log.action} {log.entity}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(log.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            by{' '}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="hover:text-accent cursor-text">
                  {log.performedBy.slice(0, 6)}...
                </TooltipTrigger>
                <TooltipContent>
                  <p>{log.performedBy}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}
      <PaginationControls
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        paramName="logPage"
        onPageChange={handlePageChange}
      />
    </div>
  );
} 