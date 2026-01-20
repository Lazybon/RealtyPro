"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Search,
  Briefcase,
  MessageCircle,
  User,
  LogOut,
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
          <Link href="/api/login">Войти</Link>
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
    { icon: Heart, label: "Избранное", href: "/favorites", count: 12 },
    { icon: Building2, label: "Мои объявления", href: "/my-listings", count: 0 },
    { icon: FileText, label: "Мои сделки", href: "/deals", count: 2 },
    { icon: Bell, label: "Уведомления", href: "/notifications", count: 5 },
    { icon: CreditCard, label: "Оплаты и подписки", href: "/billing" },
    { icon: Settings, label: "Настройки", href: "/settings" },
    { icon: Shield, label: "Безопасность", href: "/security" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">RealtyPro</span>
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/search" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-search">
              <Search className="h-4 w-4" />
              Поиск
            </Link>
            <Link href="/services" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-services">
              <Briefcase className="h-4 w-4" />
              Сервисы
            </Link>
            <Link href="/messages" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-messages">
              <MessageCircle className="h-4 w-4" />
              Сообщения
            </Link>
            <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground" data-testid="link-profile">
              <User className="h-4 w-4" />
              Профиль
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => logout()} data-testid="button-logout">
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

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
