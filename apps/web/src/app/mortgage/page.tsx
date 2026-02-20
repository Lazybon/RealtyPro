'use client';

import { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calculator,
  BarChart3,
  Share2,
  HelpCircle,
  TrendingDown,
  Building2,
} from 'lucide-react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

function SingleSlider({
  value,
  onValueChange,
  min,
  max,
  step,
  className,
}: {
  value: number;
  onValueChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  className?: string;
}) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      value={[value]}
      onValueChange={([v]) => onValueChange(v)}
      min={min}
      max={max}
      step={step}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
}

function Toggle({
  checked,
  onChange,
  'data-testid': testId,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  'data-testid'?: string;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'relative h-6 w-11 rounded-full p-0',
        checked ? 'bg-primary hover:bg-primary/90' : 'bg-muted hover:bg-muted/80'
      )}
      onClick={() => onChange(!checked)}
      data-testid={testId}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-2.5' : '-translate-x-2.5'
        )}
      />
    </Button>
  );
}

const PROGRAMS = [
  { id: 'base', label: 'Базовая', rate: 16, minRate: 16 },
  { id: 'family', label: 'Семейная', rate: 6, minRate: 6 },
  { id: 'military', label: 'Военная', rate: 19.1, minRate: 19.1 },
] as const;

const REGIONS = [
  'Москва',
  'Санкт-Петербург',
  'Московская область',
  'Краснодарский край',
  'Свердловская область',
  'Новосибирская область',
  'Республика Татарстан',
];

const LOAN_PURPOSES = [
  'Квартира на вторичном рынке',
  'Квартира в новостройке',
  'Дом с участком',
  'Комната',
  'Загородная недвижимость',
  'Рефинансирование',
];

function formatNumber(n: number): string {
  return n.toLocaleString('ru-RU');
}

function formatCurrency(n: number): string {
  return formatNumber(Math.round(n)) + ' ₽';
}

export default function MortgagePage() {
  const [region, setRegion] = useState('Москва');
  const [purpose, setPurpose] = useState('Квартира на вторичном рынке');
  const [program, setProgram] = useState<string>('base');
  const [salaryClient, setSalaryClient] = useState(true);
  const [propertyCost, setPropertyCost] = useState(11_400_000);
  const [downPayment, setDownPayment] = useState(5_825_400);
  const [useMatCapital, setUseMatCapital] = useState(false);
  const [loanTerm, setLoanTerm] = useState(30);

  const selectedProgram = PROGRAMS.find((p) => p.id === program) || PROGRAMS[0];
  const interestRate = selectedProgram.rate - (salaryClient ? 1 : 0);

  const downPaymentPercent = propertyCost > 0 ? ((downPayment / propertyCost) * 100).toFixed(1) : '0.0';

  const loanAmount = Math.max(0, propertyCost - downPayment - (useMatCapital ? 630_000 : 0));

  const calculations = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTerm * 12;

    if (loanAmount <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, overpayment: 0, requiredIncome: 0, taxDeduction: 0 };
    }

    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = monthlyPayment * totalMonths;
    const overpayment = totalPayment - loanAmount;
    const requiredIncome = monthlyPayment / 0.6;
    const taxDeduction = Math.min(loanAmount * 0.13, 650_000);

    return { monthlyPayment, totalPayment, overpayment, requiredIncome, taxDeduction };
  }, [loanAmount, interestRate, loanTerm]);

  const handlePropertyCostChange = useCallback((value: number) => {
    setPropertyCost(value);
    setDownPayment((prev) => Math.min(prev, value));
  }, []);

  const handlePropertyCostInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\s/g, '').replace(/[^\d]/g, '');
      const value = Math.min(Number(raw) || 0, 100_000_000);
      handlePropertyCostChange(value);
    },
    [handlePropertyCostChange]
  );

  const handleDownPaymentInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\s/g, '').replace(/[^\d]/g, '');
      const value = Math.min(Number(raw) || 0, propertyCost);
      setDownPayment(value);
    },
    [propertyCost]
  );

  const handleLoanTermInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const value = Math.min(Math.max(Number(raw) || 1, 1), 30);
    setLoanTerm(value);
  }, []);

  const rateRangeMin = (interestRate - 0.5).toFixed(3);
  const rateRangeMax = (interestRate + 8).toFixed(3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold" data-testid="heading-mortgage">
          Ипотечный калькулятор
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <Card data-testid="card-mortgage-form">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Регион покупки недвижимости</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="h-12 text-base" data-testid="select-region">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Цель кредита</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="h-12 text-base" data-testid="select-purpose">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOAN_PURPOSES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PROGRAMS.map((p) => (
                    <Button
                      key={p.id}
                      variant={program === p.id ? 'outline' : 'ghost'}
                      className={cn(
                        'rounded-full',
                        program === p.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border border-border text-muted-foreground'
                      )}
                      onClick={() => setProgram(p.id)}
                      data-testid={`button-program-${p.id}`}
                    >
                      {p.label}{' '}
                      <span className={program === p.id ? 'text-primary' : 'text-emerald-600'}>
                        от {p.rate}%
                      </span>
                    </Button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span>Получаю зарплату на РеалтиПро</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      или переведу зарплату
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-emerald-600">- 1%</span>
                    <Toggle
                      checked={salaryClient}
                      onChange={setSalaryClient}
                      data-testid="toggle-salary"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Стоимость недвижимости</Label>
                    <Input
                      type="text"
                      value={formatNumber(propertyCost)}
                      onChange={handlePropertyCostInput}
                      className="h-12 text-base font-medium"
                      data-testid="input-property-cost"
                    />
                  </div>
                  <SingleSlider
                    value={propertyCost}
                    onValueChange={handlePropertyCostChange}
                    min={376_000}
                    max={100_000_000}
                    step={100_000}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>376 тыс. ₽</span>
                    <span>100,0 млн ₽</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Первоначальный взнос</Label>
                      <Input
                        type="text"
                        value={formatNumber(downPayment)}
                        onChange={handleDownPaymentInput}
                        className="h-12 text-base font-medium"
                        data-testid="input-down-payment"
                      />
                    </div>
                    <span className="mt-5 text-lg font-semibold text-emerald-600">
                      {downPaymentPercent}%
                    </span>
                  </div>
                  <SingleSlider
                    value={downPayment}
                    onValueChange={setDownPayment}
                    min={0}
                    max={propertyCost}
                    step={10_000}
                  />
                  <Button
                    variant="link"
                    className="h-auto gap-1 p-0 text-sm"
                    data-testid="button-no-down-payment"
                  >
                    <TrendingDown className="h-4 w-4" />
                    Нет первоначального взноса?
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Использовать материнский капитал</span>
                  <Toggle
                    checked={useMatCapital}
                    onChange={setUseMatCapital}
                    data-testid="toggle-matcapital"
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Срок кредита</Label>
                    <Input
                      type="text"
                      value={loanTerm}
                      onChange={handleLoanTermInput}
                      className="h-12 text-base font-medium"
                      data-testid="input-loan-term"
                    />
                  </div>
                  <SingleSlider
                    value={loanTerm}
                    onValueChange={setLoanTerm}
                    min={1}
                    max={30}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 год</span>
                    <span>30 лет</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-20" data-testid="card-mortgage-results">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calculator className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Ипотека РеалтиПро</div>
                    <div className="text-xs text-muted-foreground">Ваши персональные условия</div>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      Диапазон ПСК
                      <HelpCircle className="h-3 w-3" />
                    </div>
                    <div className="text-lg font-bold" data-testid="text-rate-range">
                      {rateRangeMin}–{rateRangeMax}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Процентная ставка</div>
                    <div className="text-lg font-bold" data-testid="text-interest-rate">
                      {interestRate}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Ежемесячный платёж</div>
                    <div className="text-lg font-bold" data-testid="text-monthly-payment">
                      {formatCurrency(calculations.monthlyPayment)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Сумма кредита</div>
                    <div className="text-lg font-bold" data-testid="text-loan-amount">
                      {formatCurrency(loanAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      Налоговый вычет
                      <HelpCircle className="h-3 w-3" />
                    </div>
                    <div className="text-lg font-bold" data-testid="text-tax-deduction">
                      {formatCurrency(calculations.taxDeduction)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Необходимый доход</div>
                    <div className="text-lg font-bold" data-testid="text-required-income">
                      {formatCurrency(calculations.requiredIncome)}
                    </div>
                  </div>
                </div>

                <Button className="mb-3 w-full" size="lg" data-testid="button-submit-application">
                  Подать заявку
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2" data-testid="button-payment-schedule">
                    <BarChart3 className="h-4 w-4" />
                    График платежей
                  </Button>
                  <Button variant="outline" size="icon" data-testid="button-share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-rate-reduction">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30">
                  <TrendingDown className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Ставку можно снизить</div>
                  <div className="text-sm text-muted-foreground">Один раз, с 13-го месяца</div>
                </div>
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card className="overflow-hidden" data-testid="card-government-mortgage">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-bold">
                  Узнайте, можете ли вы взять ипотеку с&nbsp;господдержкой
                </h3>
                <Button variant="outline" className="mt-2" data-testid="button-survey">
                  Пройти опрос
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">RealtyPro</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 RealtyPro. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
