'use client';

import { useState, useEffect } from 'react';
import { PaginationControls } from './PaginationControls';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AuditLogsFilter } from './AuditLogsFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface Filters {
  action?: string;
  entity?: string;
  startDate?: Date;
  endDate?: Date;
}

export function AuditLogsList({ initialPage, itemsPerPage, totalItems }: AuditLogsListProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [totalFilteredItems, setTotalFilteredItems] = useState(totalItems);

  const fetchLogs = async (page: number, currentFilters: Filters) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      });

      if (currentFilters.action) {
        queryParams.append('action', currentFilters.action.toUpperCase());
      }
      if (currentFilters.entity) {
        queryParams.append('entity', currentFilters.entity.toUpperCase());
      }
      if (currentFilters.startDate) {
        queryParams.append('startDate', currentFilters.startDate.toISOString());
      }
      if (currentFilters.endDate) {
        queryParams.append('endDate', currentFilters.endDate.toISOString());
      }

      const response = await fetch(`/api/admin/audit-logs?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      setLogs(data.logs);
      setTotalFilteredItems(data.total);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage, filters);
  }, [currentPage, filters]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AuditLogsFilter onFilterChange={handleFilterChange} />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logs found matching your filters.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{log.action} {log.entity}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      by {log.performedBy.slice(0, 6)}...
                    </div>
                  </div>
                ))}
              </div>

              <PaginationControls
                currentPage={currentPage}
                totalItems={totalFilteredItems}
                itemsPerPage={itemsPerPage}
                paramName="logPage"
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 