'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import {
  Home as HomeIcon,
  Search,
  Briefcase,
  MessageCircle,
  User,
  LogOut,
  Building2,
  Bell,
  Calculator,
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

export function Header() {
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();

  const navItems = [
    { href: '/', icon: HomeIcon, label: 'Главная' },
    { href: '/search', icon: Search, label: 'Поиск' },
    { href: '/services', icon: Briefcase, label: 'Сервисы' },
    { href: '/mortgage', icon: Calculator, label: 'Ипотека' },
  ];

  const authNavItems = [
    { href: '/messages', icon: MessageCircle, label: 'Сообщения' },
    { href: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">RealtyPro</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
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
            <Button variant="outline" asChild data-testid="button-login">
              <Link href="/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
