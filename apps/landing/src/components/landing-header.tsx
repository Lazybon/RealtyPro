'use client';

import { useState } from 'react';
import { Building2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#services', label: 'Сервисы', testId: 'link-nav-services-mobile' },
  { href: '#security', label: 'Безопасность', testId: 'link-nav-security-mobile' },
  { href: '#popular', label: 'Квартиры', testId: 'link-nav-popular-mobile' },
] as const;

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <a href="/" className="flex shrink-0 items-center gap-2" data-testid="link-logo">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">RealtyPro</span>
        </a>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Основная навигация"
        >
          <a
            href="#services"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="link-nav-services"
          >
            Сервисы
          </a>
          <a
            href="#security"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="link-nav-security"
          >
            Безопасность
          </a>
          <a
            href="#popular"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="link-nav-popular"
          >
            Квартиры
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Открыть меню"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw-1rem,20rem)]">
              <SheetHeader className="text-left">
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <nav
                className="mt-6 flex flex-col gap-1"
                aria-label="Мобильная навигация"
              >
                {navLinks.map(({ href, label, testId }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={closeMobile}
                    className={cn(
                      'rounded-md px-2 py-3 text-base font-medium text-muted-foreground transition-colors',
                      'hover:bg-accent hover:text-foreground'
                    )}
                    data-testid={testId}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
