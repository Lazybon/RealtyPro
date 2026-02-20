"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import { useQuery } from "@tanstack/react-query";
import {
  Settings,
  Shield,
  FileText,
  CreditCard,
  Heart,
  Building2,
  ChevronRight,
  Mail,
  Calendar,
  Loader2,
  FolderOpen,
  Star,
  Scale,
} from "lucide-react";

async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

const PROFILE_STATS_QUERY = `
  query ProfileStats {
    favoriteListings {
      id
    }
    myDeals {
      id
    }
    myListings {
      id
    }
  }
`;

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['profileStats'],
    queryFn: () => graphqlRequest<{
      favoriteListings: { id: string }[];
      myDeals: { id: string }[];
      myListings: { id: string }[];
    }>(PROFILE_STATS_QUERY),
    enabled: isAuthenticated,
    retry: 1,
  });

  const favoritesCount = stats?.favoriteListings?.length ?? 0;
  const dealsCount = stats?.myDeals?.length ?? 0;
  const listingsCount = stats?.myListings?.length ?? 0;

  if (isLoading) {
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
        <p className="text-muted-foreground">Войдите в систему для доступа к личному кабинету</p>
        <Button asChild>
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    );
  }

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName || user.email || "Пользователь";

  const initials = user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email?.[0]?.toUpperCase() || "U";

  const menuItems = [
    { icon: Heart, label: "Избранное", href: "/profile/favorites", count: favoritesCount },
    { icon: Building2, label: "Мои объявления", href: "/profile/listings", count: listingsCount },
    { icon: FileText, label: "Мои сделки", href: "/profile/deals", count: dealsCount },
    { icon: FolderOpen, label: "Мои документы", href: "/profile/documents" },
    { icon: CreditCard, label: "Оплаты и подписки", href: "/profile/billing" },
    { icon: Settings, label: "Настройки", href: "/profile/settings" },
    { icon: Shield, label: "Безопасность", href: "/profile/security" },
    { icon: Scale, label: "Правовая информация", href: "/legal/terms" },
  ];

  const rating = 5.0;

  const formatRegistrationDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "недавно";
    const date = new Date(dateStr);
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card data-testid="card-user-profile">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24" data-testid="avatar-user">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={displayName} />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold" data-testid="text-user-name">{displayName}</h2>
                  {user.email && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground" data-testid="text-user-email">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                  )}
                  <Badge variant="secondary" className="mt-3" data-testid="badge-verified">
                    <Shield className="mr-1 h-3 w-3" />
                    Верифицирован
                  </Badge>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-favorites-count">
                      {statsLoading ? "–" : favoritesCount}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid="label-favorites">Избранных</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-deals-count">
                      {statsLoading ? "–" : dealsCount}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid="label-deals">Сделок</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="text-2xl font-bold text-primary" data-testid="text-rating">{rating}</div>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid="label-rating">Рейтинг</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground" data-testid="text-registration-date">
                  <Calendar className="h-4 w-4" />
                  На платформе с {formatRegistrationDate(user.createdAt)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card data-testid="card-menu">
              <CardHeader>
                <CardTitle>Личный кабинет</CardTitle>
                <CardDescription>Управляйте своим аккаунтом и настройками</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    data-testid={`link-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && item.count > 0 && (
                        <Badge variant="secondary">{item.count}</Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
