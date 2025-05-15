'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || '');

  // If no images, show placeholder
  if (images.length === 0) {
    return (
      <div className="aspect-square w-full bg-secondary flex items-center justify-center rounded-lg">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-background">
        <img
          src={mainImage}
          alt="Product image"
          className="h-full w-full object-cover object-center"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
              className={`relative aspect-square overflow-hidden rounded-md bg-background ${
                mainImage === image ? 'ring-2 ring-primary' : 'ring-1 ring-border hover:ring-2 hover:ring-primary/50'
              }`}
            >
              <img
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="h-full w-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}