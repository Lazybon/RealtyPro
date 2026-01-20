'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Home as HomeIcon,
  Search,
  FileText,
  CheckCircle,
  Shield,
  Calculator,
  FileCheck,
  Scale,
  Heart,
  Bed,
  Bath,
  Square,
  MapPin,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

const heroImage = '/images/modern_luxury_apartm_1ebc8f0f.jpg';
const apartmentImage1 = '/images/luxury_apartment_liv_8cce6e76.jpg';
const apartmentImage2 = '/images/luxury_apartment_liv_e4153194.jpg';
const apartmentImage3 = '/images/luxury_apartment_liv_8645fea3.jpg';
const apartmentImage4 = '/images/luxury_apartment_liv_a9956975.jpg';

const apartments = [
  {
    id: 1,
    title: 'Просторная 3-комн. квартира в центре',
    price: '18 500 000',
    address: 'Москва, ул. Тверская, 12',
    bedrooms: 3,
    bathrooms: 2,
    area: 98,
    image: apartmentImage1,
    badges: ['Проверено', 'Собственник'],
  },
  {
    id: 2,
    title: 'Студия в стиле Лофт',
    price: '8 900 000',
    address: 'Москва, ул. Бауманская, 44',
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    image: apartmentImage2,
    badges: ['Ипотека 5%'],
  },
  {
    id: 3,
    title: 'Видовая квартира в Москва-Сити',
    price: '45 000 000',
    address: 'Москва, Пресненская наб., 8',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    image: apartmentImage3,
    badges: ['Премиум', 'Панорамный вид'],
  },
  {
    id: 4,
    title: 'Двушка у парка Горького',
    price: '14 200 000',
    address: 'Москва, Ленинский пр-т, 24',
    bedrooms: 2,
    bathrooms: 1,
    area: 56,
    image: apartmentImage4,
    badges: ['Срочно'],
  },
];

const services = [
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HomeIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">RealtyPro</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm font-medium text-foreground" data-testid="link-home">
              Главная
            </a>
            <a href="#popular" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-search">
              Поиск
            </a>
            <a href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-services">
              Сервисы
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="link-messages">
              Сообщения
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" data-testid="button-login">
              Войти
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
          <div className="container relative mx-auto px-4 py-20 md:py-32">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20" data-testid="badge-hero">
                <CheckCircle className="mr-1.5 h-3 w-3" />
                Безопасные сделки без посредников
              </Badge>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Найдите идеальную
                <br />
                квартиру{' '}
                <span className="text-primary">напрямую от собственника</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground max-w-lg">
                Проверенные квартиры, безопасные платежи и полное юридическое сопровождение онлайн.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" data-testid="button-find-apartment">
                  <Search className="mr-2 h-4 w-4" />
                  Найти квартиру
                </Button>
                <Button size="lg" variant="outline" data-testid="button-make-deal">
                  <FileText className="mr-2 h-4 w-4" />
                  Оформить сделку
                </Button>
              </div>
              
              <div className="mt-12 flex gap-12">
                <div data-testid="stat-apartments">
                  <div className="text-3xl font-bold">15к+</div>
                  <div className="text-sm text-muted-foreground">Квартир в базе</div>
                </div>
                <div data-testid="stat-commission">
                  <div className="text-3xl font-bold">0%</div>
                  <div className="text-sm text-muted-foreground">Комиссия агентам</div>
                </div>
                <div data-testid="stat-support">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">Поддержка юристов</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="popular" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold md:text-3xl">Популярные предложения</h2>
                <p className="mt-1 text-muted-foreground">
                  Лучшие квартиры от собственников за последнюю неделю
                </p>
              </div>
              <a href="#" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex" data-testid="link-view-all">
                Смотреть все
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {apartments.map((apartment) => (
                <Card 
                  key={apartment.id} 
                  className="group overflow-hidden transition-all hover:shadow-lg"
                  data-testid={`card-apartment-${apartment.id}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={apartment.image} 
                      alt={apartment.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <button 
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground transition-colors hover:bg-white hover:text-rose-500"
                      data-testid={`button-favorite-${apartment.id}`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {apartment.badges.map((badge) => (
                        <Badge 
                          key={badge}
                          variant="secondary" 
                          className={`text-xs ${
                            badge === 'Проверено' 
                              ? 'bg-primary text-primary-foreground' 
                              : badge === 'Собственник'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                              : badge === 'Премиум'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                              : badge === 'Срочно'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 line-clamp-1 font-medium">{apartment.title}</h3>
                    <div className="mb-2 text-xl font-bold text-primary">{apartment.price} ₽</div>
                    <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="line-clamp-1">{apartment.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{apartment.bedrooms} спальни</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{apartment.bathrooms} санузла</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{apartment.area} м²</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

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

        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden border-0 bg-primary">
              <CardContent className="flex flex-col items-center justify-between gap-6 p-8 md:flex-row md:p-12">
                <div className="text-center md:text-left">
                  <h3 className="mb-2 text-2xl font-bold text-primary-foreground md:text-3xl">
                    Готовы найти квартиру мечты?
                  </h3>
                  <p className="text-primary-foreground/80">
                    Зарегистрируйтесь и получите доступ ко всем функциям бесплатно
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    data-testid="button-cta-register"
                  >
                    Создать аккаунт
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <HomeIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">RealtyPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 RealtyPro. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
