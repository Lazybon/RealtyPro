"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Loader2,
  FileText,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { graphqlRequest } from "@/lib/graphql-client";
import { MY_DEALS_QUERY } from "@/lib/graphql-operations";
import type { Deal } from "@/types/domain";

export default function DealsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['myDeals'],
    queryFn: () => graphqlRequest<{ myDeals: Deal[] }>(MY_DEALS_QUERY),
    enabled: isAuthenticated,
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

  const deals = data?.myDeals || [];

  const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "Ожидает", variant: "secondary" },
    in_progress: { label: "В процессе", variant: "default" },
    completed: { label: "Завершена", variant: "outline" },
    cancelled: { label: "Отменена", variant: "destructive" },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPartyName = (party: { firstName: string | null; lastName: string | null; email: string | null }) => {
    if (party.firstName && party.lastName) {
      return `${party.firstName} ${party.lastName}`;
    }
    return party.email || 'Пользователь';
  };

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
            <h1 className="text-2xl font-bold">Мои сделки</h1>
            <p className="text-muted-foreground">История и активные сделки</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : deals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">Нет сделок</h2>
              <p className="mb-4 text-center text-muted-foreground">
                У вас пока нет активных или завершенных сделок
              </p>
              <Button asChild>
                <Link href="/search">Найти квартиру</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => {
              const isBuyer = deal.buyerId === user.id;
              const otherParty = isBuyer ? deal.seller : deal.buyer;
              const statusInfo = statusLabels[deal.status] || statusLabels.pending;

              return (
                <Card key={deal.id} data-testid={`card-deal-${deal.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {isBuyer ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-blue-500" />
                          )}
                          <Badge variant={isBuyer ? "outline" : "secondary"}>
                            {isBuyer ? "Покупка" : "Продажа"}
                          </Badge>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                        <CardTitle className="mt-2 text-lg">{deal.listing.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {deal.listing.city}, {deal.listing.address}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {formatPrice(deal.price)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(deal.createdAt)}
                      </div>
                      <div>
                        {isBuyer ? "Продавец" : "Покупатель"}: {getPartyName(otherParty)}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/messages?deal=${deal.id}`}>
                          Написать сообщение
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
