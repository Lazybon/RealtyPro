'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Calculator,
  ShoppingCart,
  CreditCard,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, formatPricePerSqm } from '@/lib/format';

interface PriceActionPanelProps {
  price: number;
  currency: string;
  area: number;
  dealType: string;
  isFavorite: boolean;
  isFavoriteLoading: boolean;
  onToggleFavorite: () => void;
  onBuy: () => void;
  onMortgage: () => void;
  seller: {
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  monthlyMortgage: number;
}

export function PriceActionPanel({
  price,
  currency,
  area,
  dealType,
  isFavorite,
  isFavoriteLoading,
  onToggleFavorite,
  onBuy,
  onMortgage,
  seller,
  monthlyMortgage,
}: PriceActionPanelProps) {
  return (
    <Card className="sticky top-24 z-50" data-testid="card-price-panel">
      <CardContent className="space-y-5 p-6">
        <div>
          <div className="text-3xl font-bold text-primary" data-testid="text-price">
            {formatPrice(price, currency)}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {formatPricePerSqm(price, area, currency)} за м²
          </div>
        </div>

        {dealType === 'sale' && (
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calculator className="h-4 w-4" />
              <span>Ипотека от</span>
            </div>
            <div className="text-lg font-semibold" data-testid="text-mortgage-estimate">
              {new Intl.NumberFormat('ru-RU').format(monthlyMortgage)} ₽/мес
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              при 20% взносе, 18% на 20 лет
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={isFavorite ? 'default' : 'outline'}
            className={cn('flex-1', isFavorite && 'bg-rose-500 text-white')}
            onClick={onToggleFavorite}
            disabled={isFavoriteLoading}
            data-testid="button-toggle-favorite"
          >
            <Heart className={cn('mr-2 h-4 w-4', isFavorite && 'fill-current')} />
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
          <Button variant="outline" size="icon" data-testid="button-share">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {dealType === 'sale' && (
            <>
              <Button
                className="w-full"
                size="lg"
                onClick={onBuy}
                data-testid="button-buy"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Купить
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={onMortgage}
                data-testid="button-mortgage"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Взять в ипотеку
              </Button>
            </>
          )}
          {dealType === 'rent' && (
            <Button
              className="w-full"
              size="lg"
              onClick={onBuy}
              data-testid="button-rent"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Арендовать
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full" data-testid="button-call">
            <Phone className="mr-2 h-4 w-4" />
            Позвонить
          </Button>
          <Button variant="outline" className="w-full" data-testid="button-message">
            <MessageCircle className="mr-2 h-4 w-4" />
            Написать
          </Button>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              {seller.profileImageUrl ? (
                <img src={seller.profileImageUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="text-sm font-medium" data-testid="text-seller-name">
                {seller.firstName || seller.lastName
                  ? `${seller.firstName ?? ''} ${seller.lastName ?? ''}`.trim()
                  : 'Продавец'}
              </div>
              <div className="text-xs text-muted-foreground">Собственник</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
