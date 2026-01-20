'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Home as HomeIcon,
  Search,
  Heart,
  Bed,
  Bath,
  Square,
  MapPin,
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  MessageCircle,
} from 'lucide-react';

const apartmentImage1 = '/images/luxury_apartment_liv_8cce6e76.jpg';
const apartmentImage2 = '/images/luxury_apartment_liv_e4153194.jpg';
const apartmentImage3 = '/images/luxury_apartment_liv_8645fea3.jpg';
const apartmentImage4 = '/images/luxury_apartment_liv_a9956975.jpg';

const allApartments = [
  {
    id: 1,
    title: 'Просторная 3-комн. квартира в центре',
    price: 18500000,
    priceFormatted: '18 500 000',
    address: 'Москва, ул. Тверская, 12',
    district: 'ЦАО',
    bedrooms: 3,
    bathrooms: 2,
    area: 98,
    image: apartmentImage1,
    badges: ['Проверено', 'Собственник'],
    floor: 5,
    totalFloors: 12,
  },
  {
    id: 2,
    title: 'Студия в стиле Лофт',
    price: 8900000,
    priceFormatted: '8 900 000',
    address: 'Москва, ул. Бауманская, 44',
    district: 'ЦАО',
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    image: apartmentImage2,
    badges: ['Ипотека 5%'],
    floor: 3,
    totalFloors: 8,
  },
  {
    id: 3,
    title: 'Видовая квартира в Москва-Сити',
    price: 45000000,
    priceFormatted: '45 000 000',
    address: 'Москва, Пресненская наб., 8',
    district: 'ЗАО',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    image: apartmentImage3,
    badges: ['Премиум', 'Панорамный вид'],
    floor: 42,
    totalFloors: 56,
  },
  {
    id: 4,
    title: 'Двушка у парка Горького',
    price: 14200000,
    priceFormatted: '14 200 000',
    address: 'Москва, Ленинский пр-т, 24',
    district: 'ЮАО',
    bedrooms: 2,
    bathrooms: 1,
    area: 56,
    image: apartmentImage4,
    badges: ['Срочно'],
    floor: 7,
    totalFloors: 17,
  },
  {
    id: 5,
    title: 'Элитная 4-комн. квартира',
    price: 75000000,
    priceFormatted: '75 000 000',
    address: 'Москва, Остоженка, 11',
    district: 'ЦАО',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    image: apartmentImage1,
    badges: ['Премиум', 'Терраса'],
    floor: 8,
    totalFloors: 10,
  },
  {
    id: 6,
    title: 'Уютная однушка в тихом районе',
    price: 7500000,
    priceFormatted: '7 500 000',
    address: 'Москва, ул. Академика Янгеля, 5',
    district: 'ЮЗАО',
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
    image: apartmentImage2,
    badges: ['Метро рядом'],
    floor: 2,
    totalFloors: 9,
  },
];

export default function SearchPage() {
  const [priceRange, setPriceRange] = useState([5000000, 50000000]);
  const [areaRange, setAreaRange] = useState([30, 150]);
  const [rooms, setRooms] = useState<string>('any');
  const [district, setDistrict] = useState<string>('any');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);

  const filteredApartments = allApartments.filter((apt) => {
    if (apt.price < priceRange[0] || apt.price > priceRange[1]) return false;
    if (apt.area < areaRange[0] || apt.area > areaRange[1]) return false;
    if (rooms !== 'any' && apt.bedrooms !== parseInt(rooms)) return false;
    if (district !== 'any' && apt.district !== district) return false;
    return true;
  });

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} млн`;
    }
    return value.toLocaleString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <HomeIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">RealtyPro</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-home">
              Главная
            </Link>
            <Link href="/search" className="text-sm font-medium text-foreground" data-testid="link-search">
              Поиск
            </Link>
            <Link href="/services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-services">
              Сервисы
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" asChild data-testid="button-login">
              <Link href="/login">Войти</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-search">Поиск квартир</h1>
            <p className="text-muted-foreground">Найдено {filteredApartments.length} объектов</p>
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
                        setPriceRange([5000000, 50000000]);
                        setAreaRange([30, 150]);
                        setRooms('any');
                        setDistrict('any');
                      }}
                      data-testid="button-reset-filters"
                    >
                      Сбросить
                    </Button>
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
                    <Label>Район</Label>
                    <Select value={district} onValueChange={setDistrict}>
                      <SelectTrigger data-testid="select-district">
                        <SelectValue placeholder="Любой" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Любой</SelectItem>
                        <SelectItem value="ЦАО">ЦАО</SelectItem>
                        <SelectItem value="САО">САО</SelectItem>
                        <SelectItem value="СВАО">СВАО</SelectItem>
                        <SelectItem value="ВАО">ВАО</SelectItem>
                        <SelectItem value="ЮВАО">ЮВАО</SelectItem>
                        <SelectItem value="ЮАО">ЮАО</SelectItem>
                        <SelectItem value="ЮЗАО">ЮЗАО</SelectItem>
                        <SelectItem value="ЗАО">ЗАО</SelectItem>
                        <SelectItem value="СЗАО">СЗАО</SelectItem>
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
            {filteredApartments.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Ничего не найдено</h3>
                <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
                {filteredApartments.map((apartment) => (
                  <Card
                    key={apartment.id}
                    className={`group overflow-hidden transition-all hover:shadow-lg ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
                    data-testid={`card-apartment-${apartment.id}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'aspect-video md:aspect-square md:w-64' : 'aspect-[4/3]'}`}>
                      <img
                        src={apartment.image}
                        alt={apartment.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground transition-colors hover:bg-white hover:text-rose-500"
                        data-testid={`button-favorite-${apartment.id}`}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                        {apartment.badges.map((badge, i) => (
                          <Badge
                            key={i}
                            variant={badge === 'Проверено' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardContent className={`flex-1 p-4 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        <div className="mb-2 text-xl font-bold text-primary">
                          {apartment.priceFormatted} ₽
                        </div>
                        <h3 className="mb-1 font-semibold line-clamp-1">{apartment.title}</h3>
                        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{apartment.address}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{apartment.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{apartment.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          <span>{apartment.area} м²</span>
                        </div>
                        <div className="text-xs">
                          {apartment.floor}/{apartment.totalFloors} эт.
                        </div>
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
