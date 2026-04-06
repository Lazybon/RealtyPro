"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Loader2,
  Home,
  MessageCircle,
  FileText,
  Check,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "deal" | "listing" | "system";
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Новое сообщение",
    description: "Вам пришло сообщение по объявлению «2-комнатная квартира в центре»",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "2",
    type: "deal",
    title: "Статус сделки изменен",
    description: "Сделка по квартире на Тверской переведена в статус «В процессе»",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "3",
    type: "listing",
    title: "Объявление просмотрено",
    description: "Ваше объявление просмотрели 15 раз за последние сутки",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "4",
    type: "system",
    title: "Добро пожаловать!",
    description: "Добро пожаловать на RealtyPro. Начните с создания первого объявления.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

export default function NotificationsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

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
        <Bell className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Необходима авторизация</h1>
        <p className="text-muted-foreground">Войдите в систему для просмотра уведомлений</p>
        <Button asChild>
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageCircle;
      case "deal":
        return FileText;
      case "listing":
        return Home;
      default:
        return Bell;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60 * 60) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} мин. назад`;
    }
    if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return `${hours} ч. назад`;
    }
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return `${days} дн. назад`;
    }
    return date.toLocaleDateString('ru-RU');
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Уведомления</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} непрочитанных` : "Все уведомления прочитаны"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" data-testid="button-mark-all-read">
              <Check className="mr-2 h-4 w-4" />
              Прочитать все
            </Button>
          )}
        </div>

        <div className="mx-auto max-w-2xl">
          {mockNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="mb-4 h-16 w-16 text-muted-foreground" />
                <h2 className="mb-2 text-xl font-semibold">Нет уведомлений</h2>
                <p className="text-center text-muted-foreground">
                  Здесь будут появляться уведомления о сообщениях, сделках и активности
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mockNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <Card
                    key={notification.id}
                    className={notification.read ? "opacity-70" : ""}
                    data-testid={`card-notification-${notification.id}`}
                  >
                    <CardContent className="flex items-start gap-4 py-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        notification.read ? "bg-muted" : "bg-primary/10"
                      }`}>
                        <Icon className={`h-5 w-5 ${notification.read ? "text-muted-foreground" : "text-primary"}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {notification.description}
                            </p>
                          </div>
                          {!notification.read && (
                            <Badge variant="default" className="shrink-0">Новое</Badge>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0" data-testid={`button-dismiss-${notification.id}`}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
