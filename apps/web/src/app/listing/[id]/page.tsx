'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Heart,
  Bed,
  Square,
  MapPin,
  ArrowLeft,
  Share2,
  Phone,
  MessageCircle,
  Building2,
  Layers,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Calculator,
  ShoppingCart,
  CreditCard,
  CheckCircle,
  Loader2,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const GRAPHQL_URL = '/api/graphql';

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

interface Listing {
  id: string;
  userId: string;
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
  metroStation: string | null;
  images: string[];
  published: boolean;
  viewsCount: number;
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
}

const defaultImage = '/images/luxury_apartment_liv_8cce6e76.jpg';

const propertyTypeLabels: Record<string, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  studio: 'Студия',
};

const dealTypeLabels: Record<string, string> = {
  sale: 'Продажа',
  rent: 'Аренда',
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showMortgageDialog, setShowMortgageDialog] = useState(false);
  const [buyStep, setBuyStep] = useState<'confirm' | 'success'>('confirm');
  const [mortgageStep, setMortgageStep] = useState<'confirm' | 'success'>('confirm');

  const { data: listingData, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => graphqlRequest<{ listing: Listing | null }>(LISTING_QUERY, { id: listingId }),
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

  const images = listing?.images?.length ? listing.images : [defaultImage];

  const prevImage = () => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPricePerSqm = (price: number, area: number, currency: string) => {
    const pricePerSqm = Math.round(price / area);
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(pricePerSqm);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const monthlyMortgage = (price: number) => {
    const rate = 0.18 / 12;
    const months = 20 * 12;
    const principal = price * 0.8;
    const payment = (principal * rate) / (1 - Math.pow(1 + rate, -months));
    return Math.round(payment);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
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
      <Header />

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
            <div className="relative overflow-hidden rounded-xl bg-muted" data-testid="listing-gallery">
              <div className="aspect-[16/10]">
                <img
                  src={images[currentImageIndex]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {images.length > 1 && (
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
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
              <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                <Badge variant="secondary">{propertyTypeLabels[listing.propertyType] || listing.propertyType}</Badge>
                <Badge variant="default">{dealTypeLabels[listing.dealType] || listing.dealType}</Badge>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
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

            <Card data-testid="card-characteristics">
              <CardContent className="p-6">
                <h2 className="mb-4 text-lg font-semibold">Характеристики</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Bed className="h-4 w-4" />
                      <span>Комнаты</span>
                    </div>
                    <div className="font-semibold" data-testid="text-rooms">{listing.rooms === 0 ? 'Студия' : listing.rooms}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Square className="h-4 w-4" />
                      <span>Площадь</span>
                    </div>
                    <div className="font-semibold" data-testid="text-area">{listing.area} м²</div>
                  </div>
                  {listing.floor != null && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        <span>Этаж</span>
                      </div>
                      <div className="font-semibold" data-testid="text-floor">
                        {listing.floor}{listing.totalFloors ? ` из ${listing.totalFloors}` : ''}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>Тип</span>
                    </div>
                    <div className="font-semibold">{propertyTypeLabels[listing.propertyType] || listing.propertyType}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>Просмотры</span>
                    </div>
                    <div className="font-semibold" data-testid="text-views">{listing.viewsCount}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Опубликовано</span>
                    </div>
                    <div className="font-semibold" data-testid="text-date">{formatDate(listing.createdAt)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
            <Card className="sticky top-24 z-50" data-testid="card-price-panel">
              <CardContent className="space-y-5 p-6">
                <div>
                  <div className="text-3xl font-bold text-primary" data-testid="text-price">
                    {formatPrice(listing.price, listing.currency)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {formatPricePerSqm(listing.price, listing.area, listing.currency)} за м²
                  </div>
                </div>

                {listing.dealType === 'sale' && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calculator className="h-4 w-4" />
                      <span>Ипотека от</span>
                    </div>
                    <div className="text-lg font-semibold" data-testid="text-mortgage-estimate">
                      {new Intl.NumberFormat('ru-RU').format(monthlyMortgage(listing.price))} ₽/мес
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      при 20% взносе, 18% на 20 лет
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant={isFavorite ? 'default' : 'outline'}
                    className={cn('flex-1', isFavorite && 'bg-rose-500 text-white')}
                    onClick={toggleFavorite}
                    disabled={addFav.isPending || removeFav.isPending}
                    data-testid="button-toggle-favorite"
                  >
                    <Heart className={cn('mr-2 h-4 w-4', isFavorite && 'fill-current')} />
                    {isFavorite ? 'В избранном' : 'В избранное'}
                  </Button>
                  <Button variant="outline" size="icon" data-testid="button-share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {listing.dealType === 'sale' && (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => { setBuyStep('confirm'); setShowBuyDialog(true); }}
                        data-testid="button-buy"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Купить
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => { setMortgageStep('confirm'); setShowMortgageDialog(true); }}
                        data-testid="button-mortgage"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Взять в ипотеку
                      </Button>
                    </>
                  )}
                  {listing.dealType === 'rent' && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => { setBuyStep('confirm'); setShowBuyDialog(true); }}
                      data-testid="button-rent"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Арендовать
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" data-testid="button-call">
                    <Phone className="mr-2 h-4 w-4" />
                    Позвонить
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-message">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Написать
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {listing.user.profileImageUrl ? (
                        <img src={listing.user.profileImageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium" data-testid="text-seller-name">
                        {listing.user.firstName || listing.user.lastName
                          ? `${listing.user.firstName ?? ''} ${listing.user.lastName ?? ''}`.trim()
                          : 'Продавец'}
                      </div>
                      <div className="text-xs text-muted-foreground">Собственник</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent data-testid="dialog-buy">
          <DialogHeader>
            <DialogTitle>
              {buyStep === 'confirm'
                ? (listing.dealType === 'rent' ? 'Заявка на аренду' : 'Заявка на покупку')
                : 'Заявка отправлена!'}
            </DialogTitle>
          </DialogHeader>
          {buyStep === 'confirm' ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-1 font-semibold">{listing.title}</div>
                <div className="text-sm text-muted-foreground">{listing.city}, {listing.address}</div>
                <div className="mt-2 text-lg font-bold text-primary">{formatPrice(listing.price, listing.currency)}</div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <strong>Тестовый режим:</strong> Это демонстрация процесса. Реальная сделка не будет совершена.
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBuyDialog(false)} data-testid="button-buy-cancel">
                  Отмена
                </Button>
                <Button onClick={() => setBuyStep('success')} data-testid="button-buy-confirm">
                  Подтвердить заявку
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <p className="text-muted-foreground">
                Ваша заявка принята. Менеджер свяжется с вами в ближайшее время для уточнения деталей.
              </p>
              <Button className="w-full" onClick={() => setShowBuyDialog(false)} data-testid="button-buy-done">
                Отлично
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showMortgageDialog} onOpenChange={setShowMortgageDialog}>
        <DialogContent data-testid="dialog-mortgage">
          <DialogHeader>
            <DialogTitle>
              {mortgageStep === 'confirm' ? 'Заявка на ипотеку' : 'Заявка отправлена!'}
            </DialogTitle>
          </DialogHeader>
          {mortgageStep === 'confirm' ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="mb-1 font-semibold">{listing.title}</div>
                <div className="text-sm text-muted-foreground">{listing.city}, {listing.address}</div>
                <div className="mt-2 text-lg font-bold text-primary">{formatPrice(listing.price, listing.currency)}</div>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Стоимость объекта</span>
                  <span className="font-medium">{formatPrice(listing.price, listing.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Первоначальный взнос (20%)</span>
                  <span className="font-medium">{formatPrice(listing.price * 0.2, listing.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Сумма кредита</span>
                  <span className="font-medium">{formatPrice(listing.price * 0.8, listing.currency)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-muted-foreground">Платёж от</span>
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat('ru-RU').format(monthlyMortgage(listing.price))} ₽/мес
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <strong>Тестовый режим:</strong> Это демонстрация. Для точного расчёта воспользуйтесь{' '}
                <Link href="/mortgage" className="underline">ипотечным калькулятором</Link>.
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowMortgageDialog(false)} data-testid="button-mortgage-cancel">
                  Отмена
                </Button>
                <Button onClick={() => setMortgageStep('success')} data-testid="button-mortgage-confirm">
                  Отправить заявку
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <p className="text-muted-foreground">
                Ваша заявка на ипотеку принята. Банки-партнёры рассмотрят её и свяжутся с вами.
              </p>
              <Button className="w-full" onClick={() => setShowMortgageDialog(false)} data-testid="button-mortgage-done">
                Отлично
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
