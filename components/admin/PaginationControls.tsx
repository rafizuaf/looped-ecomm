'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  paramName: string;
  onPageChange?: (page: number) => Promise<void>;
}

export function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
  paramName,
  onPageChange,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (onPageChange) {
        await onPageChange(newPage);
      }
      
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, String(newPage));
      router.push(`?${params.toString()}`, { scroll: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1 || isLoading}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages || isLoading}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
} 