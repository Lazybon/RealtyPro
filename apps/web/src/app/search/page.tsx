'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

function ToggleChip({
  label,
  active,
  onClick,
  'data-testid': testId,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  'data-testid'?: string;
}) {
  return (
    <Button
      variant={active ? 'outline' : 'ghost'}
      size="sm"
      className={cn(
        'rounded-full border',
        active ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
      )}
      onClick={onClick}
      data-testid={testId}
    >
      {label}
    </Button>
  );
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  'data-testid': testId,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t pt-4">
      <Button
        variant="ghost"
        className="flex h-auto w-full items-center justify-between p-0 text-left"
        onClick={() => setOpen(!open)}
        data-testid={testId}
      >
        <span className="text-lg font-semibold">{title}</span>
        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>
      {open && <div className="mt-4 space-y-5">{children}</div>}
    </div>
  );
}

function FilterRow({ label, children, info }: { label: string; children: React.ReactNode; info?: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
      <div className="flex shrink-0 items-center gap-1 sm:w-44 sm:pt-2">
        <span className="text-sm font-medium">{label}</span>
        {info && <Info className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([1000000, 100000000]);
  const [areaRange, setAreaRange] = useState([10, 300]);
  const [rooms, setRooms] = useState<string>('any');
  const [city, setCity] = useState<string>('any');
  const [dealType, setDealType] = useState<string>('any');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [advGoal, setAdvGoal] = useState<'buy' | 'rent'>('buy');
  const [advPropertyType, setAdvPropertyType] = useState('apartment_secondary');
  const [advRooms, setAdvRooms] = useState<string[]>([]);
  const [advPriceType, setAdvPriceType] = useState<'object' | 'sqm' | 'mortgage'>('object');
  const [advPriceFrom, setAdvPriceFrom] = useState('');
  const [advPriceTo, setAdvPriceTo] = useState('');
  const [advAreaFrom, setAdvAreaFrom] = useState('');
  const [advAreaTo, setAdvAreaTo] = useState('');
  const [advFloorFrom, setAdvFloorFrom] = useState('');
  const [advFloorTo, setAdvFloorTo] = useState('');
  const [advFloorOptions, setAdvFloorOptions] = useState<string[]>([]);
  const [advTotalFloorsFrom, setAdvTotalFloorsFrom] = useState('');
  const [advTotalFloorsTo, setAdvTotalFloorsTo] = useState('');

  const [advRenovation, setAdvRenovation] = useState<string[]>([]);
  const [advKitchenArea, setAdvKitchenArea] = useState<string>('');
  const [advBathroom, setAdvBathroom] = useState<string[]>([]);
  const [advBalcony, setAdvBalcony] = useState<string[]>([]);
  const [advCeilingHeight, setAdvCeilingHeight] = useState<string>('');

  const [advSaleType, setAdvSaleType] = useState<string[]>([]);
  const [advAdvantages, setAdvAdvantages] = useState<string[]>([]);
  const [advSeller, setAdvSeller] = useState<string[]>([]);
  const [advAuction, setAdvAuction] = useState<string[]>([]);

  const [advPostDate, setAdvPostDate] = useState<string>('');
  const [advExtra, setAdvExtra] = useState<string[]>([]);

  const toggleArrayValue = useCallback((arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }, []);

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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = listing.title.toLowerCase().includes(q);
      const matchesAddress = listing.address.toLowerCase().includes(q);
      const matchesCity = listing.city.toLowerCase().includes(q);
      const matchesDistrict = listing.district?.toLowerCase().includes(q);
      const matchesMetro = listing.metroStation?.toLowerCase().includes(q);
      const matchesDesc = listing.description?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesAddress && !matchesCity && !matchesDistrict && !matchesMetro && !matchesDesc) return false;
    }
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

  const resetAdvancedFilters = () => {
    setAdvGoal('buy');
    setAdvPropertyType('apartment_secondary');
    setAdvRooms([]);
    setAdvPriceType('object');
    setAdvPriceFrom('');
    setAdvPriceTo('');
    setAdvAreaFrom('');
    setAdvAreaTo('');
    setAdvFloorFrom('');
    setAdvFloorTo('');
    setAdvFloorOptions([]);
    setAdvTotalFloorsFrom('');
    setAdvTotalFloorsTo('');
    setAdvRenovation([]);
    setAdvKitchenArea('');
    setAdvBathroom([]);
    setAdvBalcony([]);
    setAdvCeilingHeight('');
    setAdvSaleType([]);
    setAdvAdvantages([]);
    setAdvSeller([]);
    setAdvAuction([]);
    setAdvPostDate('');
    setAdvExtra([]);
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Город, район, адрес, метро..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9"
                data-testid="input-search-query"
              />
            </div>
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
                        setSearchQuery('');
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

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAdvancedFilters(true)}
                    data-testid="button-open-advanced-filters"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Все фильтры
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

      <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto" data-testid="dialog-advanced-filters">
          <DialogHeader>
            <DialogTitle className="text-2xl">Фильтры</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <FilterRow label="Цель">
              <div className="flex rounded-full border">
                <Button
                  variant={advGoal === 'buy' ? 'default' : 'ghost'}
                  className="flex-1 rounded-full rounded-r-none"
                  onClick={() => setAdvGoal('buy')}
                  data-testid="button-adv-goal-buy"
                >
                  Купить
                </Button>
                <Button
                  variant={advGoal === 'rent' ? 'default' : 'ghost'}
                  className="flex-1 rounded-full rounded-l-none"
                  onClick={() => setAdvGoal('rent')}
                  data-testid="button-adv-goal-rent"
                >
                  Снять
                </Button>
              </div>
            </FilterRow>

            <FilterRow label="Вид недвижимости">
              <Select value={advPropertyType} onValueChange={setAdvPropertyType}>
                <SelectTrigger data-testid="select-adv-property-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment_secondary">Квартира во вторичке</SelectItem>
                  <SelectItem value="apartment_new">Квартира в новостройке</SelectItem>
                  <SelectItem value="house">Дом с участком</SelectItem>
                  <SelectItem value="room">Комната</SelectItem>
                  <SelectItem value="land">Земельный участок</SelectItem>
                </SelectContent>
              </Select>
            </FilterRow>

            <FilterRow label="Количество комнат">
              <div className="flex flex-wrap gap-2">
                {['Студия', '1', '2', '3', '4', '5+'].map((r) => (
                  <ToggleChip
                    key={r}
                    label={r}
                    active={advRooms.includes(r)}
                    onClick={() => toggleArrayValue(advRooms, r, setAdvRooms)}
                    data-testid={`chip-adv-rooms-${r}`}
                  />
                ))}
              </div>
            </FilterRow>

            <FilterRow label="Цена">
              <div className="space-y-3">
                <div className="flex rounded-full border">
                  {(['object', 'sqm', 'mortgage'] as const).map((t) => (
                    <Button
                      key={t}
                      variant={advPriceType === t ? 'default' : 'ghost'}
                      className={cn(
                        'flex-1 rounded-full',
                        t === 'object' && 'rounded-r-none',
                        t === 'sqm' && 'rounded-none',
                        t === 'mortgage' && 'rounded-l-none'
                      )}
                      size="sm"
                      onClick={() => setAdvPriceType(t)}
                      data-testid={`button-adv-price-type-${t}`}
                    >
                      {t === 'object' ? 'За объект' : t === 'sqm' ? 'За м²' : 'Ипотека'}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="От"
                    value={advPriceFrom}
                    onChange={(e) => setAdvPriceFrom(e.target.value)}
                    data-testid="input-adv-price-from"
                  />
                  <Input
                    placeholder="До"
                    value={advPriceTo}
                    onChange={(e) => setAdvPriceTo(e.target.value)}
                    data-testid="input-adv-price-to"
                  />
                  <span className="flex items-center text-sm text-muted-foreground">₽</span>
                </div>
              </div>
            </FilterRow>

            <FilterRow label="Общая площадь">
              <div className="flex gap-2">
                <Input
                  placeholder="От"
                  value={advAreaFrom}
                  onChange={(e) => setAdvAreaFrom(e.target.value)}
                  data-testid="input-adv-area-from"
                />
                <Input
                  placeholder="До"
                  value={advAreaTo}
                  onChange={(e) => setAdvAreaTo(e.target.value)}
                  data-testid="input-adv-area-to"
                />
                <span className="flex items-center text-sm text-muted-foreground">м²</span>
              </div>
            </FilterRow>

            <FilterRow label="Этаж">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="От"
                    value={advFloorFrom}
                    onChange={(e) => setAdvFloorFrom(e.target.value)}
                    data-testid="input-adv-floor-from"
                  />
                  <Input
                    placeholder="До"
                    value={advFloorTo}
                    onChange={(e) => setAdvFloorTo(e.target.value)}
                    data-testid="input-adv-floor-to"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Не первый', 'Не последний', 'Последний'].map((opt) => (
                    <ToggleChip
                      key={opt}
                      label={opt}
                      active={advFloorOptions.includes(opt)}
                      onClick={() => toggleArrayValue(advFloorOptions, opt, setAdvFloorOptions)}
                      data-testid={`chip-adv-floor-${opt}`}
                    />
                  ))}
                </div>
              </div>
            </FilterRow>

            <FilterRow label="Количество этажей">
              <div className="flex gap-2">
                <Input
                  placeholder="От"
                  value={advTotalFloorsFrom}
                  onChange={(e) => setAdvTotalFloorsFrom(e.target.value)}
                  data-testid="input-adv-floors-from"
                />
                <Input
                  placeholder="До"
                  value={advTotalFloorsTo}
                  onChange={(e) => setAdvTotalFloorsTo(e.target.value)}
                  data-testid="input-adv-floors-to"
                />
              </div>
            </FilterRow>

            <CollapsibleSection title="Квартира" defaultOpen data-testid="section-apartment">
              <FilterRow label="Ремонт" info>
                <div className="flex flex-wrap gap-2">
                  {['Без ремонта', 'Евроремонт', 'Дизайнерский', 'Косметический'].map((r) => (
                    <ToggleChip
                      key={r}
                      label={r}
                      active={advRenovation.includes(r)}
                      onClick={() => toggleArrayValue(advRenovation, r, setAdvRenovation)}
                      data-testid={`chip-adv-renovation-${r}`}
                    />
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Площадь кухни">
                <div className="flex flex-wrap gap-2">
                  {['От 6 м²', 'От 7 м²', 'От 8 м²', 'От 9 м²', 'От 10 м²', 'От 12 м²', 'От 15 м²'].map((k) => (
                    <ToggleChip
                      key={k}
                      label={k}
                      active={advKitchenArea === k}
                      onClick={() => setAdvKitchenArea(advKitchenArea === k ? '' : k)}
                      data-testid={`chip-adv-kitchen-${k}`}
                    />
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Санузел">
                <div className="flex flex-wrap gap-2">
                  {['Совмещенный', 'Раздельный'].map((b) => (
                    <ToggleChip
                      key={b}
                      label={b}
                      active={advBathroom.includes(b)}
                      onClick={() => toggleArrayValue(advBathroom, b, setAdvBathroom)}
                      data-testid={`chip-adv-bathroom-${b}`}
                    />
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Балкон или лоджия">
                <div className="flex flex-wrap gap-2">
                  {['1', '2', '3+'].map((bl) => (
                    <ToggleChip
                      key={bl}
                      label={bl}
                      active={advBalcony.includes(bl)}
                      onClick={() => toggleArrayValue(advBalcony, bl, setAdvBalcony)}
                      data-testid={`chip-adv-balcony-${bl}`}
                    />
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Высота потолков">
                <div className="flex flex-wrap gap-2">
                  {['От 2,5 м', 'От 2,7 м', 'От 3 м', 'От 4 м'].map((ch) => (
                    <ToggleChip
                      key={ch}
                      label={ch}
                      active={advCeilingHeight === ch}
                      onClick={() => setAdvCeilingHeight(advCeilingHeight === ch ? '' : ch)}
                      data-testid={`chip-adv-ceiling-${ch}`}
                    />
                  ))}
                </div>
              </FilterRow>
            </CollapsibleSection>

            <CollapsibleSection title="Сделка" data-testid="section-deal">
              <FilterRow label="Тип продажи" info>
                <div className="flex flex-wrap gap-2">
                  {['Свободная', 'Альтернативная'].map((st) => (
                    <ToggleChip
                      key={st}
                      label={st}
                      active={advSaleType.includes(st)}
                      onClick={() => toggleArrayValue(advSaleType, st, setAdvSaleType)}
                      data-testid={`chip-adv-sale-${st}`}
                    />
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Преимущества" info>
                <div className="flex flex-wrap gap-2">
                  {['Одобрено в ипотеку', 'Отчёт Домклик'].map((ad) => (
                    <ToggleChip
                      key={ad}
                      label={ad}
                      active={advAdvantages.includes(ad)}
                      onClick={() => toggleArrayValue(advAdvantages, ad, setAdvAdvantages)}
                      data-testid={`chip-adv-advantage-${ad}`}
                    />
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Продавец" info>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    label="От собственника"
                    active={advSeller.includes('owner')}
                    onClick={() => toggleArrayValue(advSeller, 'owner', setAdvSeller)}
                    data-testid="chip-adv-seller-owner"
                  />
                </div>
              </FilterRow>

              <FilterRow label="Объекты с аукционов" info>
                <div className="flex flex-wrap gap-2">
                  <ToggleChip
                    label="Не показывать"
                    active={advAuction.includes('hide')}
                    onClick={() => toggleArrayValue(advAuction, 'hide', setAdvAuction)}
                    data-testid="chip-adv-auction-hide"
                  />
                </div>
              </FilterRow>
            </CollapsibleSection>

            <CollapsibleSection title="Другое" data-testid="section-other">
              <FilterRow label="Дата размещения">
                <div className="flex flex-wrap gap-2">
                  {['За час', 'Сегодня', 'За сутки', 'За 10 дней', 'За 30 дней'].map((d) => (
                    <ToggleChip
                      key={d}
                      label={d}
                      active={advPostDate === d}
                      onClick={() => setAdvPostDate(advPostDate === d ? '' : d)}
                      data-testid={`chip-adv-date-${d}`}
                    />
                  ))}
                </div>
              </FilterRow>

              <FilterRow label="Дополнительно" info>
                <div className="flex flex-wrap gap-2">
                  {['Только с видео', 'Только с фото', 'Доступен онлайн-показ'].map((ex) => (
                    <ToggleChip
                      key={ex}
                      label={ex}
                      active={advExtra.includes(ex)}
                      onClick={() => toggleArrayValue(advExtra, ex, setAdvExtra)}
                      data-testid={`chip-adv-extra-${ex}`}
                    />
                  ))}
                </div>
              </FilterRow>
            </CollapsibleSection>
          </div>

          <DialogFooter className="sticky bottom-0 z-50 border-t bg-background pt-4">
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1 gap-2" data-testid="button-adv-save-search">
                <Heart className="h-4 w-4" />
                Сохранить поиск
              </Button>
              <Button variant="outline" className="flex-1" onClick={resetAdvancedFilters} data-testid="button-adv-reset">
                Сбросить фильтры
              </Button>
              <Button className="flex-1" onClick={() => {
                if (advGoal === 'buy') setDealType('sale');
                else if (advGoal === 'rent') setDealType('rent');

                if (advRooms.length === 1) {
                  const r = advRooms[0];
                  if (r === 'Студия') setRooms('any');
                  else if (r === '5+') setRooms('4');
                  else setRooms(r);
                }

                if (advPriceFrom || advPriceTo) {
                  setPriceRange([
                    advPriceFrom ? Number(advPriceFrom) : 1000000,
                    advPriceTo ? Number(advPriceTo) : 100000000,
                  ]);
                }

                if (advAreaFrom || advAreaTo) {
                  setAreaRange([
                    advAreaFrom ? Number(advAreaFrom) : 10,
                    advAreaTo ? Number(advAreaTo) : 300,
                  ]);
                }

                setShowAdvancedFilters(false);
              }} data-testid="button-adv-apply">
                Показать {filteredListings.length} предложений
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
