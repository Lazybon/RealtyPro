'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/format';

interface BuyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealType: string;
  title: string;
  city: string;
  address: string;
  price: number;
  currency: string;
}

export function BuyDialog({
  open,
  onOpenChange,
  dealType,
  title,
  city,
  address,
  price,
  currency,
}: BuyDialogProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');

  const handleOpenChange = (v: boolean) => {
    if (!v) setStep('confirm');
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid="dialog-buy">
        <DialogHeader>
          <DialogTitle>
            {step === 'confirm'
              ? (dealType === 'rent' ? 'Заявка на аренду' : 'Заявка на покупку')
              : 'Заявка отправлена!'}
          </DialogTitle>
        </DialogHeader>
        {step === 'confirm' ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="mb-1 font-semibold">{title}</div>
              <div className="text-sm text-muted-foreground">{city}, {address}</div>
              <div className="mt-2 text-lg font-bold text-primary">{formatPrice(price, currency)}</div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <strong>Тестовый режим:</strong> Это демонстрация процесса. Реальная сделка не будет совершена.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)} data-testid="button-buy-cancel">
                Отмена
              </Button>
              <Button onClick={() => setStep('success')} data-testid="button-buy-confirm">
                Подтвердить заявку
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <p className="text-muted-foreground">
              Ваша заявка принята. Менеджер свяжется с вами в ближайшее время для уточнения деталей.
            </p>
            <Button className="w-full" onClick={() => handleOpenChange(false)} data-testid="button-buy-done">
              Отлично
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
