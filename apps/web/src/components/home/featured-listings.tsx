import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';

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

function getBadgeClassName(badge: string): string {
  if (badge === 'Проверено') return 'bg-primary text-primary-foreground';
  if (badge === 'Собственник') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
  if (badge === 'Премиум') return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
  if (badge === 'Срочно') return 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300';
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
}

export function FeaturedListings() {
  return (
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
                      className={`text-xs ${getBadgeClassName(badge)}`}
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
  );
}
