"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  CreditCard,
  Check,
  Crown,
} from "lucide-react";

export default function BillingPage() {
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
        <h1 className="text-2xl font-bold">Необходима авторизация</h1>
        <Button asChild>
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    );
  }

  const plans = [
    {
      name: "Бесплатный",
      price: "0 ₽",
      period: "навсегда",
      current: true,
      features: [
        "До 3 объявлений",
        "Базовая статистика",
        "Поддержка по email",
      ],
    },
    {
      name: "Про",
      price: "990 ₽",
      period: "в месяц",
      current: false,
      popular: true,
      features: [
        "Безлимит объявлений",
        "Расширенная статистика",
        "Приоритетная поддержка",
        "Выделение объявлений",
        "Без рекламы",
      ],
    },
    {
      name: "Бизнес",
      price: "2990 ₽",
      period: "в месяц",
      current: false,
      features: [
        "Все функции Про",
        "API доступ",
        "Командные аккаунты",
        "Персональный менеджер",
        "Кастомизация профиля",
      ],
    },
  ];

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
            <h1 className="text-2xl font-bold">Оплаты и подписки</h1>
            <p className="text-muted-foreground">Управляйте планом и платежами</p>
          </div>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Текущий план
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">Бесплатный план</div>
                  <div className="text-sm text-muted-foreground">
                    Базовые функции для начала работы
                  </div>
                </div>
                <Badge variant="secondary">Активен</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="mb-4 text-xl font-bold">Доступные планы</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.popular ? "border-primary" : ""}
              data-testid={`card-plan-${plan.name.toLowerCase()}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {plan.name === "Бизнес" && <Crown className="h-5 w-5 text-yellow-500" />}
                    {plan.name}
                  </CardTitle>
                  {plan.popular && <Badge>Популярный</Badge>}
                  {plan.current && <Badge variant="outline">Текущий</Badge>}
                </div>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground"> / {plan.period}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-full"
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                  data-testid={`button-select-${plan.name.toLowerCase()}`}
                >
                  {plan.current ? "Текущий план" : "Выбрать план"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
