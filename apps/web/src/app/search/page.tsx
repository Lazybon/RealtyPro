'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Loader2,
  Home as HomeIcon,
} from 'lucide-react';
import { graphqlRequest } from '@/lib/graphql';
import type { Listing } from '@/lib/types';
import { SearchFiltersPanel } from '@/components/search/search-filters-panel';
import { SearchListingCard } from '@/components/search/search-listing-card';
import { AdvancedFiltersDialog } from '@/components/search/advanced-filters-dialog';

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

  const { data, isLoading } = useQuery({
    queryKey: ['listings', 'published'],
    queryFn: () => graphqlRequest<{ listings: Listing[] }>(LISTINGS_QUERY, { published: true }),
  });

  const listings = data?.listings || [];

  const filteredListings = listings.filter((listing) => {
    if (listing.price < priceRange[0] || listing.price > priceRange[1]) return false;
    if (listing.area < areaRange[0] || listing.area > areaRange[1]) return false;
    if (rooms === 'studio' && listing.rooms !== 0 && listing.propertyType !== 'studio') return false;
    if (rooms !== 'any' && rooms !== 'studio' && listing.rooms !== parseInt(rooms)) return false;
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

  return (
    <div className="min-h-screen bg-background">
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
            <SearchFiltersPanel
              dealType={dealType}
              setDealType={setDealType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              areaRange={areaRange}
              setAreaRange={setAreaRange}
              rooms={rooms}
              setRooms={setRooms}
              city={city}
              setCity={setCity}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenAdvancedFilters={() => setShowAdvancedFilters(true)}
            />
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
                  <SearchListingCard key={listing.id} listing={listing} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <AdvancedFiltersDialog
        open={showAdvancedFilters}
        onOpenChange={setShowAdvancedFilters}
        filteredCount={filteredListings.length}
        onApply={(params) => {
          if (params.dealType) setDealType(params.dealType);
          if (params.rooms) setRooms(params.rooms);
          if (params.priceRange) setPriceRange(params.priceRange);
          if (params.areaRange) setAreaRange(params.areaRange);
        }}
      />
    </div>
  );
}
