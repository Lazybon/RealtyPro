'use client';

import { useState } from 'react';
import Link from 'next/link';
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

interface MortgageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  city: string;
  address: string;
  price: number;
  currency: string;
  monthlyPayment: number;
}

export function MortgageDialog({
  open,
  onOpenChange,
  title,
  city,
  address,
  price,
  currency,
  monthlyPayment,
}: MortgageDialogProps) {
  const [step, setStep] = useState<'confirm' | 'success'>('confirm');

  const handleOpenChange = (v: boolean) => {
    if (!v) setStep('confirm');
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid="dialog-mortgage">
        <DialogHeader>
          <DialogTitle>
            {step === 'confirm' ? 'Заявка на ипотеку' : 'Заявка отправлена!'}
          </DialogTitle>
        </DialogHeader>
        {step === 'confirm' ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="mb-1 font-semibold">{title}</div>
              <div className="text-sm text-muted-foreground">{city}, {address}</div>
              <div className="mt-2 text-lg font-bold text-primary">{formatPrice(price, currency)}</div>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Стоимость объекта</span>
                <span className="font-medium">{formatPrice(price, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Первоначальный взнос (20%)</span>
                <span className="font-medium">{formatPrice(price * 0.2, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Сумма кредита</span>
                <span className="font-medium">{formatPrice(price * 0.8, currency)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-muted-foreground">Платёж от</span>
                <span className="font-bold text-primary">
                  {new Intl.NumberFormat('ru-RU').format(monthlyPayment)} ₽/мес
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <strong>Тестовый режим:</strong> Это демонстрация. Для точного расчёта воспользуйтесь{' '}
              <Link href="/mortgage" className="underline">ипотечным калькулятором</Link>.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)} data-testid="button-mortgage-cancel">
                Отмена
              </Button>
              <Button onClick={() => setStep('success')} data-testid="button-mortgage-confirm">
                Отправить заявку
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <p className="text-muted-foreground">
              Ваша заявка на ипотеку принята. Банки-партнёры рассмотрят её и свяжутся с вами.
            </p>
            <Button className="w-full" onClick={() => handleOpenChange(false)} data-testid="button-mortgage-done">
              Отлично
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
