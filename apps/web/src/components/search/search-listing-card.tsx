'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Bed, Square, MapPin } from 'lucide-react';
import { DEFAULT_IMAGE, propertyTypeLabels, dealTypeLabels } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { Listing } from '@/lib/types';

interface SearchListingCardProps {
  listing: Listing;
  viewMode: 'grid' | 'list';
}

export function SearchListingCard({ listing, viewMode }: SearchListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}`} className="block" data-testid={`link-listing-${listing.id}`}>
      <Card
        className={`group overflow-hidden transition-all hover:shadow-lg ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
        data-testid={`card-listing-${listing.id}`}
      >
        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'aspect-video md:aspect-square md:w-64' : 'aspect-[4/3]'}`}>
          <img
            src={listing.images[0] || DEFAULT_IMAGE}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground transition-colors hover:bg-white hover:text-rose-500"
            data-testid={`button-favorite-${listing.id}`}
          >
            <Heart className="h-4 w-4" />
          </button>
          <div className="absolute left-3 top-3 flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {propertyTypeLabels[listing.propertyType] || listing.propertyType}
            </Badge>
            <Badge variant="default" className="text-xs">
              {dealTypeLabels[listing.dealType] || listing.dealType}
            </Badge>
          </div>
        </div>
        <CardContent className={`flex-1 p-4 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
          <div>
            <div className="mb-2 text-xl font-bold text-primary">
              {formatPrice(listing.price, listing.currency)}
            </div>
            <h3 className="mb-1 font-semibold line-clamp-1">{listing.title}</h3>
            <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{listing.city}, {listing.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{listing.rooms} комн.</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{listing.area} м²</span>
            </div>
            {listing.floor && listing.totalFloors && (
              <div className="text-xs">
                {listing.floor}/{listing.totalFloors} эт.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
