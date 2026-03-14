import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  FileText,
  Calculator,
  FileCheck,
  Scale,
  CheckCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const services: Service[] = [
  {
    icon: Shield,
    title: 'Проверка недвижимости',
    description: 'Полный отчёт из Росреестра и ФНС: проверка обременений, арестов, собственников.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    icon: FileText,
    title: 'Генератор документов',
    description: 'Автоматическое создание ДКП, акта приема-передачи и расписок за 2 минуты.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    icon: Calculator,
    title: 'Ипотечный калькулятор',
    description: 'Сравните ставки топ-10 банков и отправьте одну заявку сразу во все.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    icon: Calculator,
    title: 'Налоговый помощник',
    description: 'Расчет налога с продажи, помощь в оформлении налогового вычета.',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    icon: FileCheck,
    title: 'Электронная регистрация',
    description: 'Отправка документов в Росреестр без посещения МФЦ. Быстро и безопасно.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    icon: Scale,
    title: 'Юридическое сопровождение',
    description: 'Консультация профильного юриста и проверка чистоты сделки.',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
  },
];

const securitySteps = [
  {
    number: 1,
    title: 'Проверка юридической чистоты',
    description: 'Автоматически проверяем обременения, залоги и историю владения через Росреестр.',
  },
  {
    number: 2,
    title: 'Безопасные расчеты',
    description: 'Деньги хранятся на специальном счете и переводятся продавцу только после регистрации права собственности.',
  },
  {
    number: 3,
    title: 'Электронная регистрация',
    description: 'Подаем документы в Росреестр онлайн, без очередей и поездок в МФЦ.',
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-8 text-2xl font-bold md:text-3xl">
              Как мы защищаем ваши сделки
            </h2>
            <div className="space-y-6">
              {securitySteps.map((step) => (
                <div key={step.number} className="flex gap-4" data-testid={`security-step-${step.number}`}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Card className="w-full max-w-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-3/4 rounded-full bg-primary" />
                </div>
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                  <div className="h-3 w-3/5 rounded bg-muted" />
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-primary">Объект проверен</div>
                    <div className="text-sm text-muted-foreground">Обременений не найдено</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Сервисы для безопасных сделок
          </h2>
          <p className="text-muted-foreground">
            Все инструменты для покупки и продажи недвижимости в одном месте
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="transition-all hover:shadow-md"
              data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardContent className="p-6">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${service.bgColor}`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <h3 className="mb-2 font-semibold">{service.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid={`button-service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
