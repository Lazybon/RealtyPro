'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import { formatShortPrice } from '@/lib/format';

interface SearchFiltersPanelProps {
  dealType: string;
  setDealType: (v: string) => void;
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  areaRange: number[];
  setAreaRange: (v: number[]) => void;
  rooms: string;
  setRooms: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onOpenAdvancedFilters: () => void;
}

export function SearchFiltersPanel({
  dealType,
  setDealType,
  priceRange,
  setPriceRange,
  areaRange,
  setAreaRange,
  rooms,
  setRooms,
  city,
  setCity,
  searchQuery,
  setSearchQuery,
  onOpenAdvancedFilters,
}: SearchFiltersPanelProps) {
  return (
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
            <Label>Цена: {formatShortPrice(priceRange[0])} — {formatShortPrice(priceRange[1])} ₽</Label>
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
                <SelectItem value="studio">Студия</SelectItem>
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
            onClick={onOpenAdvancedFilters}
            data-testid="button-open-advanced-filters"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Все фильтры
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
