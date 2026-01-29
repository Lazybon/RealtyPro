'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Header } from '@/components/header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Heart,
  Bed,
  Square,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  Loader2,
  Home as HomeIcon,
} from 'lucide-react';

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
  metroStation: string | null;
  images: string[];
  published: boolean;
  viewsCount: number;
  createdAt: string;
  user?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
}

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

const LISTINGS_QUERY = `
  query Listings($published: Boolean, $city: String) {
    listings(published: $published, city: $city) {
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
      metroStation
      images
      published
      viewsCount
      createdAt
    }
  }
`;

const defaultImage = '/images/luxury_apartment_liv_8cce6e76.jpg';

export default function SearchPage() {
  const [priceRange, setPriceRange] = useState([1000000, 100000000]);
  const [areaRange, setAreaRange] = useState([10, 300]);
  const [rooms, setRooms] = useState<string>('any');
  const [city, setCity] = useState<string>('any');
  const [dealType, setDealType] = useState<string>('any');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ['listings', 'published'],
    queryFn: () => graphqlRequest<{ listings: Listing[] }>(LISTINGS_QUERY, { published: true }),
  });

  const listings = data?.listings || [];

  const filteredListings = listings.filter((listing) => {
    if (listing.price < priceRange[0] || listing.price > priceRange[1]) return false;
    if (listing.area < areaRange[0] || listing.area > areaRange[1]) return false;
    if (rooms !== 'any' && listing.rooms !== parseInt(rooms)) return false;
    if (city !== 'any' && listing.city !== city) return false;
    if (dealType !== 'any' && listing.dealType !== dealType) return false;
    return true;
  });

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} млн`;
    }
    return value.toLocaleString('ru-RU');
  };

  const formatFullPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const propertyTypeLabels: Record<string, string> = {
    apartment: 'Квартира',
    house: 'Дом',
    studio: 'Студия',
  };

  const dealTypeLabels: Record<string, string> = {
    sale: 'Продажа',
    rent: 'Аренда',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-search">Поиск квартир</h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Загрузка...' : `Найдено ${filteredListings.length} объектов`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Фильтры
            </Button>
            <div className="flex rounded-md border">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode('grid')}
                data-testid="button-view-grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode('list')}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {showFilters && (
            <aside className="w-full shrink-0 lg:w-72">
              <Card data-testid="card-filters">
                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Фильтры</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPriceRange([1000000, 100000000]);
                        setAreaRange([10, 300]);
                        setRooms('any');
                        setCity('any');
                        setDealType('any');
                      }}
                      data-testid="button-reset-filters"
                    >
                      Сбросить
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Тип сделки</Label>
                    <Select value={dealType} onValueChange={setDealType}>
                      <SelectTrigger data-testid="select-deal-type">
                        <SelectValue placeholder="Любой" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Любой</SelectItem>
                        <SelectItem value="sale">Продажа</SelectItem>
                        <SelectItem value="rent">Аренда</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label>Цена: {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])} ₽</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={1000000}
                      max={100000000}
                      step={500000}
                      data-testid="slider-price"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Площадь: {areaRange[0]} — {areaRange[1]} м²</Label>
                    <Slider
                      value={areaRange}
                      onValueChange={setAreaRange}
                      min={10}
                      max={300}
                      step={5}
                      data-testid="slider-area"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Количество комнат</Label>
                    <Select value={rooms} onValueChange={setRooms}>
                      <SelectTrigger data-testid="select-rooms">
                        <SelectValue placeholder="Любое" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Любое</SelectItem>
                        <SelectItem value="1">1 комната</SelectItem>
                        <SelectItem value="2">2 комнаты</SelectItem>
                        <SelectItem value="3">3 комнаты</SelectItem>
                        <SelectItem value="4">4+ комнаты</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Город</Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger data-testid="select-city">
                        <SelectValue placeholder="Любой" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Любой</SelectItem>
                        <SelectItem value="Москва">Москва</SelectItem>
                        <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                        <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                        <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                        <SelectItem value="Казань">Казань</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" data-testid="button-apply-filters">
                    <Search className="mr-2 h-4 w-4" />
                    Найти
                  </Button>
                </CardContent>
              </Card>
            </aside>
          )}

          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredListings.length === 0 ? (
              <Card className="p-12 text-center">
                <HomeIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Объявлений пока нет</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска или создайте первое объявление
                </p>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                {filteredListings.map((listing) => (
                  <Card
                    key={listing.id}
                    className={`group overflow-hidden transition-all hover:shadow-lg ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                    data-testid={`card-listing-${listing.id}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'aspect-video md:aspect-square md:w-64' : 'aspect-[4/3]'}`}>
                      <img
                        src={listing.images[0] || defaultImage}
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
                          {formatFullPrice(listing.price, listing.currency)}
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
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
