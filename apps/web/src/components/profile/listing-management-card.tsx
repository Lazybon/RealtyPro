'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, EyeOff, MapPin, Bed, Square } from 'lucide-react';
import { propertyTypeLabels, dealTypeLabels } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { Listing } from '@/lib/types';

interface ListingManagementCardProps {
  listing: Listing;
  onTogglePublish: (id: string, published: boolean) => void;
  onDelete: (id: string) => void;
  isPublishing: boolean;
  isDeleting: boolean;
}

export function ListingManagementCard({
  listing,
  onTogglePublish,
  onDelete,
  isPublishing,
  isDeleting,
}: ListingManagementCardProps) {
  return (
    <Card data-testid={`card-listing-${listing.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {listing.city}, {listing.address}
            </CardDescription>
          </div>
          <Badge variant={listing.published ? "default" : "secondary"}>
            {listing.published ? "Опубликовано" : "Черновик"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(listing.price, listing.currency)}
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              {listing.rooms} комн.
            </span>
            <span className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              {listing.area} м²
            </span>
            {listing.floor && listing.totalFloors && (
              <span>{listing.floor}/{listing.totalFloors} эт.</span>
            )}
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{propertyTypeLabels[listing.propertyType]}</Badge>
          <Badge variant="outline">{dealTypeLabels[listing.dealType]}</Badge>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {listing.viewsCount}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePublish(listing.id, !listing.published)}
            disabled={isPublishing}
            data-testid={`button-toggle-publish-${listing.id}`}
          >
            {listing.published ? (
              <>
                <EyeOff className="mr-1 h-3 w-3" />
                Скрыть
              </>
            ) : (
              <>
                <Eye className="mr-1 h-3 w-3" />
                Опубликовать
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            data-testid={`button-edit-${listing.id}`}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (confirm('Удалить объявление?')) {
                onDelete(listing.id);
              }
            }}
            disabled={isDeleting}
            data-testid={`button-delete-${listing.id}`}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
