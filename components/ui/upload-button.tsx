'use client';

import { UploadButton as UploadThingButton } from '@uploadthing/react';
import { OurFileRouter } from '@/app/api/uploadthing/core';

interface UploadButtonProps {
  endpoint: keyof OurFileRouter;
  onClientUploadComplete?: (
    res?: {
      name: string;
      url: string;
      size: number;
    }[]
  ) => void;
  onUploadError?: (error: Error) => void;
}

export function UploadButton({
  endpoint,
  onClientUploadComplete,
  onUploadError,
}: UploadButtonProps) {
  return (
    <UploadThingButton<OurFileRouter, keyof OurFileRouter>
      endpoint={endpoint}
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
    />
  );
}