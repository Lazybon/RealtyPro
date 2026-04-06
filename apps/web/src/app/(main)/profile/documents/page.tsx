"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  FolderOpen,
} from "lucide-react";

export default function DocumentsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Необходима авторизация</h1>
        <p className="text-muted-foreground">Войдите в систему для доступа к документам</p>
        <Button asChild>
          <Link href="/login" data-testid="link-login">Войти</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild data-testid="button-back">
            <Link href="/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Мои документы</h1>
            <p className="text-muted-foreground">Документы по сделкам и договоры</p>
          </div>
        </div>

        <Card data-testid="card-documents-empty">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 mt-4 text-xl font-semibold" data-testid="text-empty-title">Нет документов</h2>
            <p className="max-w-md text-muted-foreground" data-testid="text-empty-description">
              Здесь будут отображаться документы по вашим сделкам: договоры купли-продажи, акты приёма-передачи и другие важные документы.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
