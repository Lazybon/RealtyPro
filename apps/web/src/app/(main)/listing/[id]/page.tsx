'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { ArrowLeft, Building2, MapPin, Loader2 } from 'lucide-react';
import { graphqlRequest } from '@/lib/graphql';
import type { ListingWithUser } from '@/lib/types';
import { ImageGallery } from '@/components/listing/image-gallery';
import { PropertyCharacteristics } from '@/components/listing/property-characteristics';
import { PriceActionPanel } from '@/components/listing/price-action-panel';
import { BuyDialog } from '@/components/listing/buy-dialog';
import { MortgageDialog } from '@/components/listing/mortgage-dialog';

const LISTING_QUERY = `
  query Listing($id: ID!) {
    listing(id: $id) {
      id
      userId
      title
      description
      propertyType
      dealType
      price
      currency
      area
      rooms
      floor
      totalFloors
      address
      city
      district
      metroStation
      images
      published
      viewsCount
      createdAt
      user {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`;

const IS_FAVORITE_QUERY = `
  query IsFavorite($listingId: String!) {
    isFavorite(listingId: $listingId)
  }
`;

const ADD_FAVORITE = `
  mutation AddToFavorites($listingId: String!) {
    addToFavorites(listingId: $listingId) { id }
  }
`;

const REMOVE_FAVORITE = `
  mutation RemoveFromFavorites($listingId: String!) {
    removeFromFavorites(listingId: $listingId) { id }
  }
`;

function calculateMonthlyMortgage(price: number): number {
  const rate = 0.18 / 12;
  const months = 20 * 12;
  const principal = price * 0.8;
  const payment = (principal * rate) / (1 - Math.pow(1 + rate, -months));
  return Math.round(payment);
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showMortgageDialog, setShowMortgageDialog] = useState(false);

  const { data: listingData, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => graphqlRequest<{ listing: ListingWithUser | null }>(LISTING_QUERY, { id: listingId }),
    enabled: !!listingId,
  });

  const { data: favData, refetch: refetchFav } = useQuery({
    queryKey: ['isFavorite', listingId],
    queryFn: () => graphqlRequest<{ isFavorite: boolean }>(IS_FAVORITE_QUERY, { listingId }),
    enabled: !!listingId,
  });

  const addFav = useMutation({
    mutationFn: () => graphqlRequest(ADD_FAVORITE, { listingId }),
    onSuccess: () => refetchFav(),
  });

  const removeFav = useMutation({
    mutationFn: () => graphqlRequest(REMOVE_FAVORITE, { listingId }),
    onSuccess: () => refetchFav(),
  });

  const listing = listingData?.listing;
  const isFavorite = favData?.isFavorite ?? false;

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFav.mutate();
    } else {
      addFav.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <Building2 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Объявление не найдено</h1>
          <p className="mb-6 text-muted-foreground">Возможно, оно было удалено или ещё не опубликовано</p>
          <Button asChild data-testid="button-back-to-search">
            <Link href="/search">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к поиску
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} data-testid="button-go-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/search" className="hover:text-primary" data-testid="link-breadcrumb-search">Поиск</Link>
            <span>/</span>
            <span className="text-foreground">{listing.title}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery
              images={listing.images}
              title={listing.title}
              propertyType={listing.propertyType}
              dealType={listing.dealType}
            />

            <div>
              <h1 className="mb-2 text-2xl font-bold md:text-3xl" data-testid="text-listing-title">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span data-testid="text-listing-address">
                  {listing.city}{listing.district ? `, ${listing.district}` : ''}, {listing.address}
                </span>
              </div>
              {listing.metroStation && (
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>м. {listing.metroStation}</span>
                </div>
              )}
            </div>

            <PropertyCharacteristics
              rooms={listing.rooms}
              area={listing.area}
              floor={listing.floor}
              totalFloors={listing.totalFloors}
              propertyType={listing.propertyType}
              viewsCount={listing.viewsCount}
              createdAt={listing.createdAt}
            />

            {listing.description && (
              <Card data-testid="card-description">
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Описание</h2>
                  <p className="whitespace-pre-line text-muted-foreground" data-testid="text-description">
                    {listing.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card data-testid="card-location">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Расположение</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{listing.city}{listing.district ? `, ${listing.district}` : ''}, {listing.address}</span>
                  </div>
                  {listing.metroStation && (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span>Станция метро: {listing.metroStation}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <MapPin className="mr-2 h-5 w-5" />
                  Карта скоро будет доступна
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <PriceActionPanel
              price={listing.price}
              currency={listing.currency}
              area={listing.area}
              dealType={listing.dealType}
              isFavorite={isFavorite}
              isFavoriteLoading={addFav.isPending || removeFav.isPending}
              onToggleFavorite={toggleFavorite}
              onBuy={() => setShowBuyDialog(true)}
              onMortgage={() => setShowMortgageDialog(true)}
              seller={listing.user}
              monthlyMortgage={calculateMonthlyMortgage(listing.price)}
            />
          </div>
        </div>
      </main>

      <BuyDialog
        open={showBuyDialog}
        onOpenChange={setShowBuyDialog}
        dealType={listing.dealType}
        title={listing.title}
        city={listing.city}
        address={listing.address}
        price={listing.price}
        currency={listing.currency}
      />

      <MortgageDialog
        open={showMortgageDialog}
        onOpenChange={setShowMortgageDialog}
        title={listing.title}
        city={listing.city}
        address={listing.address}
        price={listing.price}
        currency={listing.currency}
        monthlyPayment={calculateMonthlyMortgage(listing.price)}
      />
    </div>
  );
}
