'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Home as HomeIcon,
  Shield,
  FileText,
  Calculator,
  FileCheck,
  Scale,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Clock,
  Zap,
  BadgeCheck,
  Banknote,
} from 'lucide-react';

const services = [
  {
    id: 'property-check',
    icon: Shield,
    title: 'Проверка недвижимости',
    shortDesc: 'Полный отчёт из Росреестра и ФНС',
    fullDesc: 'Получите полную юридическую проверку объекта недвижимости: история собственников, обременения, аресты, судебные дела, задолженности по ЖКХ. Отчёт формируется автоматически из официальных источников.',
    features: ['Выписка из ЕГРН', 'Проверка собственников', 'История сделок', 'Обременения и аресты', 'Судебные дела'],
    price: 'от 990 ₽',
    popular: true,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    id: 'documents',
    icon: FileText,
    title: 'Генератор документов',
    shortDesc: 'Автоматическое создание ДКП за 2 минуты',
    fullDesc: 'Создайте юридически грамотные документы для сделки: договор купли-продажи, акт приёма-передачи, расписка о получении денег. Все документы проверены юристами и соответствуют законодательству.',
    features: ['Договор купли-продажи', 'Акт приёма-передачи', 'Расписка', 'Предварительный договор', 'Дополнительные соглашения'],
    price: 'от 1 490 ₽',
    popular: false,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  },
  {
    id: 'mortgage',
    icon: Calculator,
    title: 'Ипотечный калькулятор',
    shortDesc: 'Сравните ставки топ-10 банков',
    fullDesc: 'Рассчитайте ипотеку и сравните предложения от ведущих банков. Одна заявка — ответы от всех банков. Персональный менеджер поможет выбрать лучшее предложение.',
    features: ['Расчёт платежа', 'Сравнение банков', 'Одна заявка во все банки', 'Персональный менеджер', 'Онлайн одобрение'],
    price: 'Бесплатно',
    popular: true,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    id: 'tax',
    icon: Banknote,
    title: 'Налоговый помощник',
    shortDesc: 'Расчёт налогов и вычетов',
    fullDesc: 'Рассчитайте налог с продажи недвижимости и узнайте, как его уменьшить. Получите помощь в оформлении налогового вычета при покупке жилья — до 260 000 ₽.',
    features: ['Расчёт налога', 'Налоговый вычет', 'Заполнение 3-НДФЛ', 'Подача в ФНС', 'Консультация'],
    price: 'от 1 990 ₽',
    popular: false,
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
  },
  {
    id: 'registration',
    icon: FileCheck,
    title: 'Электронная регистрация',
    shortDesc: 'Регистрация сделки онлайн',
    fullDesc: 'Зарегистрируйте переход права собственности без посещения МФЦ. Подача документов в Росреестр онлайн, отслеживание статуса в личном кабинете.',
    features: ['Подача в Росреестр', 'Без посещения МФЦ', 'Отслеживание статуса', 'Получение выписки', 'Поддержка 24/7'],
    price: 'от 4 990 ₽',
    popular: false,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
  },
  {
    id: 'legal',
    icon: Scale,
    title: 'Юридическое сопровождение',
    shortDesc: 'Полное сопровождение сделки',
    fullDesc: 'Профессиональные юристы проведут вашу сделку от начала до конца: проверка документов, согласование условий, присутствие на сделке, контроль расчётов.',
    features: ['Проверка документов', 'Согласование условий', 'Присутствие на сделке', 'Контроль расчётов', 'Гарантия безопасности'],
    price: 'от 29 990 ₽',
    popular: false,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
  },
];

const stats = [
  { icon: Users, value: '50 000+', label: 'Довольных клиентов' },
  { icon: CheckCircle, value: '120 000+', label: 'Проверенных объектов' },
  { icon: Star, value: '4.9', label: 'Средняя оценка' },
  { icon: Clock, value: '< 5 мин', label: 'Среднее время отчёта' },
];

export default function ServicesPage() {

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <HomeIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">RealtyPro</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-home">
              Главная
            </Link>
            <Link href="/search" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-search">
              Поиск
            </Link>
            <Link href="/services" className="text-sm font-medium text-foreground" data-testid="link-services">
              Сервисы
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" asChild data-testid="button-login">
              <Link href="/api/login">Войти</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4" variant="secondary" data-testid="badge-services">
              <Zap className="mr-1 h-3 w-3" />
              Все сервисы в одном месте
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl" data-testid="heading-services">
              Сервисы для <span className="text-primary">безопасных сделок</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Проверка недвижимости, подготовка документов, ипотека и юридическое сопровождение — 
              всё, что нужно для покупки или продажи квартиры
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center" data-testid={`stat-card-${index}`}>
                  <CardContent className="p-6">
                    <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold md:text-3xl">Выберите нужный сервис</h2>
              <p className="text-muted-foreground">Каждый сервис разработан для максимальной безопасности вашей сделки</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="group relative overflow-hidden transition-all hover:shadow-lg"
                  data-testid={`card-service-${service.id}`}
                >
                  {service.popular && (
                    <div className="absolute right-4 top-4">
                      <Badge variant="default" className="bg-primary">
                        <Star className="mr-1 h-3 w-3" />
                        Популярно
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${service.bgColor}`}>
                      <service.icon className={`h-7 w-7 ${service.color}`} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.shortDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{service.fullDesc}</p>
                    
                    <div className="space-y-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {service.features.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{service.features.length - 3} ещё
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="text-lg font-bold text-primary">{service.price}</div>
                      <Button asChild data-testid={`button-try-${service.id}`}>
                        <Link href="/api/login">
                          Попробовать
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden border-0 bg-primary">
              <CardContent className="flex flex-col items-center justify-between gap-6 p-8 md:flex-row md:p-12">
                <div className="text-center md:text-left">
                  <h3 className="mb-2 text-2xl font-bold text-primary-foreground md:text-3xl">
                    Нужна помощь с выбором?
                  </h3>
                  <p className="text-primary-foreground/80">
                    Наши специалисты подберут оптимальный набор сервисов для вашей сделки
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    data-testid="button-consultation"
                  >
                    <Link href="/api/login">Получить консультацию</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold md:text-3xl">Почему выбирают нас</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Card data-testid="card-advantage-1">
                <CardContent className="p-6 text-center">
                  <BadgeCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 font-semibold">Официальные данные</h3>
                  <p className="text-sm text-muted-foreground">
                    Все отчёты формируются из официальных источников: Росреестр, ФНС, ФССП
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-advantage-2">
                <CardContent className="p-6 text-center">
                  <Zap className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 font-semibold">Быстро и удобно</h3>
                  <p className="text-sm text-muted-foreground">
                    Получите результат за несколько минут без посещения офисов и очередей
                  </p>
                </CardContent>
              </Card>
              <Card data-testid="card-advantage-3">
                <CardContent className="p-6 text-center">
                  <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 font-semibold">Гарантия безопасности</h3>
                  <p className="text-sm text-muted-foreground">
                    Страхование ответственности и полная конфиденциальность ваших данных
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HomeIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">RealtyPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 RealtyPro. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
