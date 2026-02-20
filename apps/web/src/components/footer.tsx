"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold" data-testid="link-footer-logo">
              <Building2 className="h-5 w-5 text-primary" />
              <span>RealtyPro</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground" data-testid="text-footer-description">
              Платформа для поиска и продажи недвижимости
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Платформа</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/search" data-testid="link-footer-search">
                  Поиск недвижимости
                </Link>
              </li>
              <li>
                <Link href="/services" data-testid="link-footer-services">
                  Сервисы
                </Link>
              </li>
              <li>
                <Link href="/mortgage" data-testid="link-footer-mortgage">
                  Ипотечный калькулятор
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Правовая информация</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/legal/terms" data-testid="link-footer-terms">
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" data-testid="link-footer-privacy">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Контакты</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li data-testid="text-footer-email">support@realtypro.ru</li>
              <li data-testid="text-footer-phone">8 (800) 123-45-67</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground" data-testid="text-copyright">
          © {new Date().getFullYear()} RealtyPro. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
