"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/header";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import {
  ArrowLeft,
  Plus,
  Building2,
  Loader2,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  Bed,
  Square,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
}

const GRAPHQL_URL = typeof window !== 'undefined' 
  ? '/api/graphql' 
  : process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

async function graphqlRequest<T>(query: string, variables?: Record<string, any>): Promise<T> {
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

const MY_LISTINGS_QUERY = `
  query MyListings {
    myListings {
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

const CREATE_LISTING_MUTATION = `
  mutation CreateListing($input: CreateListingInput!) {
    createListing(input: $input) {
      id
      title
    }
  }
`;

const PUBLISH_LISTING_MUTATION = `
  mutation PublishListing($id: ID!, $published: Boolean!) {
    publishListing(id: $id, published: $published) {
      id
      published
    }
  }
`;

const DELETE_LISTING_MUTATION = `
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

export default function MyListingsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    dealType: 'sale',
    price: '',
    area: '',
    rooms: '1',
    floor: '',
    totalFloors: '',
    address: '',
    city: 'Москва',
    district: '',
    metroStation: '',
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['myListings'],
    queryFn: () => graphqlRequest<{ myListings: Listing[] }>(MY_LISTINGS_QUERY),
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (input: any) => graphqlRequest(CREATE_LISTING_MUTATION, { input }),
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setFormData({
        title: '',
        description: '',
        propertyType: 'apartment',
        dealType: 'sale',
        price: '',
        area: '',
        rooms: '1',
        floor: '',
        totalFloors: '',
        address: '',
        city: 'Москва',
        district: '',
        metroStation: '',
      });
    },
    onError: (error) => {
      console.error('Failed to create listing:', error);
      alert('Ошибка при создании объявления: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    },
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      graphqlRequest(PUBLISH_LISTING_MUTATION, { id, published }),
    onSuccess: () => refetch(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => graphqlRequest(DELETE_LISTING_MUTATION, { id }),
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate({
      title: formData.title,
      description: formData.description || null,
      propertyType: formData.propertyType,
      dealType: formData.dealType,
      price: parseFloat(formData.price),
      area: parseFloat(formData.area),
      rooms: parseInt(formData.rooms),
      floor: formData.floor ? parseInt(formData.floor) : null,
      totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
      address: formData.address,
      city: formData.city,
      district: formData.district || null,
      metroStation: formData.metroStation || null,
      published: false,
    });
  };

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

  const listings = data?.myListings || [];

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
            <h1 className="text-2xl font-bold">Мои объявления</h1>
            <p className="text-muted-foreground">Управляйте своими объявлениями о продаже</p>
          </div>
        </div>

        <div className="mb-6 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-listing">
                <Plus className="mr-2 h-4 w-4" />
                Добавить объявление
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Новое объявление</DialogTitle>
                <DialogDescription>
                  Заполните информацию о недвижимости
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Например: 2-комнатная квартира в центре"
                    required
                    data-testid="input-title"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Тип недвижимости</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                    >
                      <SelectTrigger data-testid="select-property-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Квартира</SelectItem>
                        <SelectItem value="house">Дом</SelectItem>
                        <SelectItem value="studio">Студия</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealType">Тип сделки</Label>
                    <Select
                      value={formData.dealType}
                      onValueChange={(value) => setFormData({ ...formData, dealType: value })}
                    >
                      <SelectTrigger data-testid="select-deal-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Продажа</SelectItem>
                        <SelectItem value="rent">Аренда</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Цена (₽) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="5000000"
                      required
                      data-testid="input-price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Площадь (м²) *</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="45"
                      required
                      data-testid="input-area"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="rooms">Комнат *</Label>
                    <Select
                      value={formData.rooms}
                      onValueChange={(value) => setFormData({ ...formData, rooms: value })}
                    >
                      <SelectTrigger data-testid="select-rooms">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Этаж</Label>
                    <Input
                      id="floor"
                      type="number"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder="5"
                      data-testid="input-floor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalFloors">Всего этажей</Label>
                    <Input
                      id="totalFloors"
                      type="number"
                      value={formData.totalFloors}
                      onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                      placeholder="12"
                      data-testid="input-total-floors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Город *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                  >
                    <SelectTrigger data-testid="select-city">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Москва">Москва</SelectItem>
                      <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                      <SelectItem value="Новосибирск">Новосибирск</SelectItem>
                      <SelectItem value="Екатеринбург">Екатеринбург</SelectItem>
                      <SelectItem value="Казань">Казань</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адрес *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="ул. Тверская, д. 10"
                    required
                    data-testid="input-address"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="district">Район</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="Центральный"
                      data-testid="input-district"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metroStation">Метро</Label>
                    <Input
                      id="metroStation"
                      value={formData.metroStation}
                      onChange={(e) => setFormData({ ...formData, metroStation: e.target.value })}
                      placeholder="Тверская"
                      data-testid="input-metro"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Опишите преимущества вашей недвижимости..."
                    rows={4}
                    data-testid="input-description"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Создать
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">Нет объявлений</h2>
              <p className="mb-4 text-center text-muted-foreground">
                У вас пока нет объявлений. Создайте первое!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Добавить объявление
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <Card key={listing.id} data-testid={`card-listing-${listing.id}`}>
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
                      onClick={() => publishMutation.mutate({
                        id: listing.id,
                        published: !listing.published,
                      })}
                      disabled={publishMutation.isPending}
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
                          deleteMutation.mutate(listing.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${listing.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
