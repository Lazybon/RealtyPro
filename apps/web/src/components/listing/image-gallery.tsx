'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { propertyTypeLabels, dealTypeLabels, DEFAULT_IMAGE } from '@/lib/constants';

interface ImageGalleryProps {
  images: string[];
  title: string;
  propertyType: string;
  dealType: string;
}

export function ImageGallery({ images, title, propertyType, dealType }: ImageGalleryProps) {
  const displayImages = images.length ? images : [DEFAULT_IMAGE];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = () => setCurrentImageIndex((i) => (i === 0 ? displayImages.length - 1 : i - 1));
  const nextImage = () => setCurrentImageIndex((i) => (i === displayImages.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="relative overflow-hidden rounded-xl bg-muted" data-testid="listing-gallery">
        <div className="aspect-[16/10]">
          <img
            src={displayImages[currentImageIndex]}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              onClick={prevImage}
              data-testid="button-prev-image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full shadow-md"
              onClick={nextImage}
              data-testid="button-next-image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          <Badge variant="secondary">{propertyTypeLabels[propertyType] || propertyType}</Badge>
          <Badge variant="default">{dealTypeLabels[dealType] || dealType}</Badge>
        </div>
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              className={cn(
                'h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                i === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              )}
              onClick={() => setCurrentImageIndex(i)}
              data-testid={`button-thumbnail-${i}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
