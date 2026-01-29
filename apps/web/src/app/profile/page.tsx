"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "@/components/header";
import {
  Search,
  MessageCircle,
  Settings,
  Shield,
  FileText,
  Bell,
  CreditCard,
  Heart,
  Building2,
  ChevronRight,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

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
    { icon: Heart, label: "Избранное", href: "/profile/favorites", count: 12 },
    { icon: Building2, label: "Мои объявления", href: "/profile/listings", count: 0 },
    { icon: FileText, label: "Мои сделки", href: "/profile/deals", count: 2 },
    { icon: CreditCard, label: "Оплаты и подписки", href: "/profile/billing" },
    { icon: Settings, label: "Настройки", href: "/profile/settings" },
    { icon: Shield, label: "Безопасность", href: "/profile/security" },
  ];

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
                  <Badge variant="secondary" className="mt-3">
                    <Shield className="mr-1 h-3 w-3" />
                    Верифицирован
                  </Badge>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-xs text-muted-foreground">Избранных</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2</div>
                    <div className="text-xs text-muted-foreground">Сделок</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">4.9</div>
                    <div className="text-xs text-muted-foreground">Рейтинг</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  На платформе с января 2024
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

            <Card className="mt-6" data-testid="card-quick-actions">
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Button asChild className="h-auto flex-col gap-2 py-6">
                  <Link href="/search">
                    <Search className="h-6 w-6" />
                    <span>Найти квартиру</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto flex-col gap-2 py-6">
                  <Link href="/messages">
                    <MessageCircle className="h-6 w-6" />
                    <span>Мои чаты</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
