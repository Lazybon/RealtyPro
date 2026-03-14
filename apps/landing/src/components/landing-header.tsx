'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Building2 } from 'lucide-react';

interface LandingHeaderProps {
  onRegisterClick: () => void;
}

export function LandingHeader({ onRegisterClick }: LandingHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <a href="/" className="flex items-center gap-2" data-testid="link-logo">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">RealtyPro</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-services">
            Сервисы
          </a>
          <a href="#security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-security">
            Безопасность
          </a>
          <a href="#popular" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-nav-popular">
            Квартиры
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" onClick={onRegisterClick} data-testid="button-header-register">
            Войти
          </Button>
          <Button onClick={onRegisterClick} data-testid="button-header-signup">
            Регистрация
          </Button>
        </div>
      </div>
    </header>
  );
}
