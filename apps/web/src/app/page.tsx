'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Database,
  Server,
  Globe,
  Layers,
  Package,
  Code2,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Next.js 15',
    description: 'App Router с Server Components и оптимизированным рендерингом',
    badge: 'Frontend',
  },
  {
    icon: Server,
    title: 'Apollo Server 4',
    description: 'GraphQL API с поддержкой subscriptions и federation',
    badge: 'Backend',
  },
  {
    icon: Database,
    title: 'Prisma ORM',
    description: 'Type-safe доступ к PostgreSQL с автогенерацией типов',
    badge: 'Database',
  },
  {
    icon: Layers,
    title: 'Pothos GraphQL',
    description: 'Type-safe схема GraphQL без code-first генерации',
    badge: 'Schema',
  },
  {
    icon: Package,
    title: 'Turborepo',
    description: 'Высокопроизводительная система сборки для monorepo',
    badge: 'Infrastructure',
  },
  {
    icon: Code2,
    title: 'GraphQL Codegen',
    description: 'Автоматическая генерация TypeScript типов и хуков',
    badge: 'Tooling',
  },
];

const stackItems = [
  { name: 'TypeScript', version: '5.7' },
  { name: 'React', version: '19.0' },
  { name: 'Next.js', version: '15.1' },
  { name: 'Apollo Client', version: '3.12' },
  { name: 'Apollo Server', version: '4.11' },
  { name: 'Prisma', version: '6.1' },
  { name: 'Pothos', version: '4.3' },
  { name: 'Tailwind CSS', version: '3.4' },
  { name: 'shadcn/ui', version: 'latest' },
  { name: 'Turborepo', version: '2.3' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">GraphQL Monorepo</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden sm:flex">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Готов к разработке
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            Turborepo + Next.js 15 + Apollo + Prisma
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Fullstack GraphQL
            <span className="block text-primary">Monorepo Template</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Современный стек для разработки полноценных приложений с type-safe GraphQL API,
            автогенерацией типов и высокопроизводительной системой сборки.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" data-testid="button-get-started">
              Начать разработку
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" data-testid="button-docs">
              Документация
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold">Ключевые технологии</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition-all hover:shadow-lg"
                data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Технический стек</CardTitle>
              <CardDescription className="text-center">
                Последние версии всех зависимостей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-3">
                {stackItems.map((item) => (
                  <Badge
                    key={item.name}
                    variant="outline"
                    className="px-3 py-1 text-sm"
                    data-testid={`badge-stack-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.name}{' '}
                    <span className="ml-1 text-muted-foreground">v{item.version}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Структура проекта</CardTitle>
              <CardDescription>Организация monorepo с Turborepo</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-sm">
                {`├── apps/
│   ├── web/          # Next.js 15 приложение
│   └── server/       # Apollo Server + Prisma
├── packages/
│   ├── shared-graphql/ # Общие типы GraphQL
│   ├── config/        # Общие конфигурации
│   └── database/      # Prisma клиент
├── turbo.json         # Конфигурация Turborepo
├── docker-compose.yml # Docker для PostgreSQL
└── package.json       # Корневой package.json`}
              </pre>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Fullstack GraphQL Monorepo Template</p>
          <p className="mt-1">Создано с использованием современного TypeScript стека</p>
        </div>
      </footer>
    </div>
  );
}
