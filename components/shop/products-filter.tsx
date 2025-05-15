'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ProductsFilterProps {
  categories: string[];
  selectedCategory?: string;
  selectedSort?: string;
}

export function ProductsFilter({ 
  categories, 
  selectedCategory, 
  selectedSort = 'newest' 
}: ProductsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/products?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/products');
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Sort by</h3>
        <Select
          value={selectedSort}
          onValueChange={(value) => updateFilter('sort', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        <RadioGroup 
          value={selectedCategory || ''} 
          onValueChange={(value) => updateFilter('category', value || null)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All Categories</Label>
          </div>

          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={category} />
              <Label htmlFor={category} className="cursor-pointer">{category}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );
}