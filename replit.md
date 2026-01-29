# Fullstack GraphQL Monorepo

## Overview
Современный fullstack monorepo проект на TypeScript со следующим стеком:
- **Frontend**: Next.js 15 с App Router, Apollo Client, Tailwind CSS, shadcn/ui
- **Backend**: Apollo Server 4, Prisma ORM 7, Pothos GraphQL
- **Infrastructure**: Turborepo, Docker для локального PostgreSQL

## Структура проекта

```
├── apps/
│   ├── web/              # Next.js 15 приложение (порт 5000)
│   └── server/           # Apollo Server + Prisma (порт 4000)
├── packages/
│   ├── shared-graphql/   # Общие типы GraphQL и операции
│   ├── config/           # Общие конфигурации
│   └── database/         # Prisma схема и клиент
├── server/               # Launcher для обоих приложений
├── turbo.json            # Конфигурация Turborepo
├── docker-compose.yml    # Docker для локального PostgreSQL
└── package.json          # Корневой package.json
```

## Запуск проекта

### Replit
Проект автоматически запускается командой `npm run dev`, которая стартует:
1. Apollo Server на порту 4000
2. Next.js на порту 5000

### Локальная разработка (с Docker)
```bash
# Запуск PostgreSQL через Docker
docker-compose up -d

# Генерация Prisma клиента
cd packages/database && npx prisma generate

# Применение схемы к БД
cd packages/database && npx prisma db push

# Запуск в режиме разработки
npm run dev
```

## Переменные окружения
- `DATABASE_URL` - URL подключения к PostgreSQL (автоматически настроен в Replit)
- `SERVER_PORT` - Порт Apollo Server (по умолчанию 4000)
- `NEXT_PUBLIC_GRAPHQL_URL` - URL GraphQL API для фронтенда

## Основные технологии

### Frontend (apps/web)
- **Next.js 16** с App Router и Turbopack
- **Apollo Client 3.12** для GraphQL запросов
- **Tailwind CSS 3.4** + **shadcn/ui** компоненты
- **React 19** с Server Components
- **next-themes** для темной/светлой темы

### Backend (apps/server)
- **Apollo Server 4.11** - GraphQL сервер
- **Pothos 4.3** - Type-safe GraphQL схема builder
- **Prisma 7.2** ORM с PostgreSQL adapter

### Shared Packages
- `@repo/shared-graphql` - GraphQL типы, операции и фрагменты
- `@repo/config` - Общие конфигурации приложения
- `@repo/database` - Prisma клиент и схема

## GraphQL API (порт 4000)

### Queries
- `users` - получить всех пользователей
- `user(id: ID!)` - получить пользователя по ID
- `posts(published: Boolean)` - получить посты (опционально фильтр по published)
- `post(id: ID!)` - получить пост по ID

### Mutations
- `createUser(input: CreateUserInput!)` - создать пользователя
- `updateUser(id: ID!, input: UpdateUserInput!)` - обновить пользователя
- `deleteUser(id: ID!)` - удалить пользователя
- `createPost(input: CreatePostInput!)` - создать пост
- `updatePost(id: ID!, input: UpdatePostInput!)` - обновить пост
- `deletePost(id: ID!)` - удалить пост
- `publishPost(id: ID!)` - опубликовать пост

## Модели данных

### User
- `id` - уникальный идентификатор (CUID)
- `email` - email (уникальный)
- `name` - имя (опционально)
- `password` - хешированный пароль
- `posts` - связь с постами
- `createdAt`, `updatedAt` - временные метки

### Post
- `id` - уникальный идентификатор (CUID)
- `title` - заголовок
- `content` - содержание (опционально)
- `published` - флаг публикации
- `authorId` - ID автора
- `author` - связь с пользователем
- `createdAt`, `updatedAt` - временные метки

## Архитектура

### Объявления (Listings)
Система объявлений работает следующим образом:
- Создание объявлений через форму в `/profile/listings` сохраняет их в PostgreSQL
- Объявления со статусом `published: true` отображаются на странице `/search`
- GraphQL proxy (`/api/graphql`) передает userId из сессии в Apollo Server через заголовок `x-user-id`
- Фильтрация на странице поиска: цена, площадь, комнаты, город, тип сделки

### Type-safe GraphQL с Pothos
Схема GraphQL определена с использованием Pothos builder, что обеспечивает:
- Полную типобезопасность
- Автодополнение в IDE
- Валидацию схемы на этапе компиляции

### Prisma 7 с Driver Adapters
Используется новый подход Prisma 7 с driver adapters для подключения к PostgreSQL:
- `@prisma/adapter-pg` для прямого подключения
- Конфигурация в `prisma.config.ts`

### Apollo Client в Next.js
- Использует отдельные импорты для React Turbopack совместимости
- Настроен для SSR и клиентского рендеринга
- Кеширование с InMemoryCache

## Скрипты

- `npm run dev` - запуск в режиме разработки (оба приложения)
- `npm run build` - сборка проекта через Turborepo
- `npm run lint` - проверка кода ESLint
- `npm run format` - форматирование Prettier

### Prisma скрипты (из packages/database)
- `npx prisma generate` - генерация Prisma клиента
- `npx prisma db push` - применение схемы к БД
- `npx prisma studio` - визуальный редактор БД

## Аутентификация (Replit Auth)

### API Routes
- `/api/login` - инициирует OIDC авторизацию через Replit
- `/api/callback` - обрабатывает callback от OIDC, создает сессию, сохраняет пользователя в БД
- `/api/logout` - уничтожает сессию и перенаправляет на OIDC logout
- `/api/auth/user` - возвращает данные текущего пользователя или 401

### Технологии
- **openid-client** - OIDC клиент для Replit Auth
- **iron-session** - безопасные encrypted cookies для сессий
- Cookie name: `realtypro_session`

### Сессия
- Хранит userId, accessToken, refreshToken, expiresAt, claims
- Автоматическое обновление токена при истечении

## Страницы RealtyPro

### Публичные
- `/` - Главная страница с маркетинговым контентом
- `/search` - Поиск недвижимости с фильтрами
- `/services` - Услуги платформы

### Защищенные (требуют авторизации)
- `/profile` - Личный кабинет пользователя
- `/messages` - Чаты по сделкам и поддержка

### Навигация
- Таб "Сообщения" отображается только для авторизованных пользователей
- Аватар и кнопка выхода для авторизованных
- Кнопка "Войти" для неавторизованных

## Особенности

1. **Monorepo с Turborepo** - высокопроизводительная система сборки с кешированием
2. **Type-safe end-to-end** - от БД до фронтенда через Prisma и Pothos
3. **Hot reload** - автоматическая перезагрузка при изменениях
4. **Темная/светлая тема** - поддержка системных настроек
5. **shadcn/ui** - готовые красивые компоненты
6. **Replit Auth** - безопасная OIDC аутентификация
7. **React Query** - эффективное управление состоянием и кеширование
