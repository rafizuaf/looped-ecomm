'use client';

import { useState, useEffect } from 'react';
import { PaginationControls } from './PaginationControls';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Order {
  id: string;
  user: {
    name: string;
  };
  createdAt: string;
  total: number;
  status: string;
}

interface OrdersListProps {
  initialPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export function OrdersList({ initialPage, itemsPerPage, totalItems }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders?page=${page}&limit=${itemsPerPage}`);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
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
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        <>
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="font-medium leading-none">{order.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium leading-none">${(order.total / 100).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
              </div>
            </div>
          ))}
          <PaginationControls
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            paramName="orderPage"
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
} 