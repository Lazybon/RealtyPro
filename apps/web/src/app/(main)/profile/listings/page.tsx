"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, Building2, Loader2 } from "lucide-react";
import { graphqlRequest } from "@/lib/graphql";
import type { Listing } from "@/lib/types";
import { ListingManagementCard } from "@/components/profile/listing-management-card";
import { CreateListingDialog } from "@/components/profile/create-listing-dialog";

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

const INITIAL_FORM_DATA = {
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
};

export default function MyListingsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['myListings'],
    queryFn: () => graphqlRequest<{ myListings: Listing[] }>(MY_LISTINGS_QUERY),
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (input: Record<string, unknown>) => graphqlRequest(CREATE_LISTING_MUTATION, { input }),
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setFormData({ ...INITIAL_FORM_DATA });
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

  return (
    <div className="min-h-screen bg-background">
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
          <CreateListingDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            isPending={createMutation.isPending}
          />
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
              <ListingManagementCard
                key={listing.id}
                listing={listing}
                onTogglePublish={(id, published) => publishMutation.mutate({ id, published })}
                onDelete={(id) => deleteMutation.mutate(id)}
                isPublishing={publishMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
