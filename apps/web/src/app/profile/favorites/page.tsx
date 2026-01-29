"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Loader2,
  Heart,
  HeartOff,
  MapPin,
  Bed,
  Square,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  propertyType: string;
  dealType: string;
  price: number;
  currency: string;
  area: number;
  rooms: number;
  floor: number | null;
  totalFloors: number | null;
  address: string;
  city: string;
  district: string | null;
  images: string[];
}

const GRAPHQL_URL = typeof window !== 'undefined' 
  ? '/api/graphql' 
  : process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL Error');
  }
  return json.data;
}

const FAVORITE_LISTINGS_QUERY = `
  query FavoriteListings {
    favoriteListings {
      id
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
      images
    }
  }
`;

const REMOVE_FROM_FAVORITES_MUTATION = `
  mutation RemoveFromFavorites($listingId: String!) {
    removeFromFavorites(listingId: $listingId) {
      id
    }
  }
`;

export default function FavoritesPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['favoriteListings'],
    queryFn: () => graphqlRequest<{ favoriteListings: Listing[] }>(FAVORITE_LISTINGS_QUERY),
    enabled: isAuthenticated,
  });

  const removeMutation = useMutation({
    mutationFn: (listingId: string) =>
      graphqlRequest(REMOVE_FROM_FAVORITES_MUTATION, { listingId }),
    onSuccess: () => refetch(),
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Необходима авторизация</h1>
        <Button asChild>
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    );
  }

  const listings = data?.favoriteListings || [];

  const propertyTypeLabels: Record<string, string> = {
    apartment: 'Квартира',
    house: 'Дом',
    studio: 'Студия',
  };

  const dealTypeLabels: Record<string, string> = {
    sale: 'Продажа',
    rent: 'Аренда',
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Избранное</h1>
            <p className="text-muted-foreground">Сохраненные объявления</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">Нет избранных</h2>
              <p className="mb-4 text-center text-muted-foreground">
                Добавляйте понравившиеся объявления в избранное
              </p>
              <Button asChild>
                <Link href="/search">Найти квартиру</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Card key={listing.id} data-testid={`card-favorite-${listing.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.city}, {listing.address}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMutation.mutate(listing.id)}
                      disabled={removeMutation.isPending}
                      data-testid={`button-remove-favorite-${listing.id}`}
                    >
                      <HeartOff className="h-4 w-4 text-destructive" />
                    </Button>
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
                  <div className="mb-4 flex items-center gap-2">
                    <Badge variant="outline">{propertyTypeLabels[listing.propertyType]}</Badge>
                    <Badge variant="outline">{dealTypeLabels[listing.dealType]}</Badge>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/listing/${listing.id}`}>Подробнее</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
