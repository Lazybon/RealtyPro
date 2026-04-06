'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import {
  Search,
  Briefcase,
  MessageCircle,
  User,
  LogOut,
  Building2,
  Bell,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

function NavLink({ href, icon: Icon, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
        isActive ? 'text-foreground' : 'text-muted-foreground'
      )}
      data-testid={`link-${href.replace('/', '') || 'home'}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onNavigate,
}: NavLinkProps & { onNavigate: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-md px-2 py-3 text-base font-medium transition-colors hover:bg-accent',
        isActive ? 'bg-accent/60 text-foreground' : 'text-muted-foreground'
      )}
      data-testid={`mobile-link-${href.replace('/', '') || 'home'}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();

  const navItems = [
    { href: '/search', icon: Search, label: 'Поиск' },
    { href: '/services', icon: Briefcase, label: 'Сервисы' },
  ];

  const authNavItems = [
    { href: '/messages', icon: MessageCircle, label: 'Сообщения' },
    { href: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" data-testid="link-logo">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">RealtyPro</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Основная навигация">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
          {isAuthenticated &&
            authNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
              />
            ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
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
            <SheetContent side="right" className="flex w-[min(100vw-1rem,20rem)] flex-col">
              <SheetHeader className="text-left">
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Мобильная навигация">
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={pathname === item.href}
                    onNavigate={closeMobile}
                  />
                ))}
                {isAuthenticated &&
                  authNavItems.map((item) => (
                    <MobileNavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      isActive={pathname === item.href}
                      onNavigate={closeMobile}
                    />
                  ))}
                {isAuthenticated && (
                  <MobileNavLink
                    href="/notifications"
                    icon={Bell}
                    label="Уведомления"
                    isActive={pathname === '/notifications'}
                    onNavigate={closeMobile}
                  />
                )}
                {!isAuthenticated && !isLoading && (
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link href="/login" onClick={closeMobile} data-testid="mobile-link-login">
                      Войти
                    </Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden sm:inline-flex"
                data-testid="button-notifications"
              >
                <Link href="/notifications" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    3
                  </span>
                </Link>
              </Button>
              <Link href="/profile" data-testid="link-user-avatar">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                disabled={isLoggingOut}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" asChild className="hidden sm:inline-flex" data-testid="button-login">
              <Link href="/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
