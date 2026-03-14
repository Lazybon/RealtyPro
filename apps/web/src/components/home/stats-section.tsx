import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  TrendingUp,
  Star,
  Banknote,
  Shield,
  Award,
  Clock,
} from 'lucide-react';

export function StatsSection() {
  return (
    <section className="border-t py-16" data-testid="section-stats">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Нам доверяют <span className="text-primary">тысячи клиентов</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            За 5 лет работы мы помогли тысячам людей безопасно купить и продать недвижимость
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center" data-testid="stat-clients">
            <CardContent className="p-6">
              <Users className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="text-3xl font-bold">50 000+</div>
              <div className="text-sm text-muted-foreground">Довольных клиентов</div>
            </CardContent>
          </Card>
          <Card className="text-center" data-testid="stat-deals">
            <CardContent className="p-6">
              <TrendingUp className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="text-3xl font-bold">120 000+</div>
              <div className="text-sm text-muted-foreground">Успешных сделок</div>
            </CardContent>
          </Card>
          <Card className="text-center" data-testid="stat-rating">
            <CardContent className="p-6">
              <Star className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="text-3xl font-bold">4.9</div>
              <div className="text-sm text-muted-foreground">Средняя оценка</div>
            </CardContent>
          </Card>
          <Card className="text-center" data-testid="stat-savings">
            <CardContent className="p-6">
              <Banknote className="mx-auto mb-3 h-10 w-10 text-primary" />
              <div className="text-3xl font-bold">2.5 млрд ₽</div>
              <div className="text-sm text-muted-foreground">Сэкономили клиентам</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function AdvantagesSection() {
  return (
    <section className="border-t bg-muted/30 py-16" data-testid="section-advantages">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Почему выбирают <span className="text-primary">RealtyPro</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Безопасность сделок</h3>
            <p className="text-muted-foreground">
              Все объекты проходят юридическую проверку. Защита от мошенничества и гарантия возврата средств.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Только собственники</h3>
            <p className="text-muted-foreground">
              Никаких посредников и скрытых комиссий. Вы общаетесь напрямую с владельцами недвижимости.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Быстрое оформление</h3>
            <p className="text-muted-foreground">
              Электронная регистрация сделки за 1-3 дня. Все документы готовятся автоматически.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="border-t py-16" data-testid="section-testimonials">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Отзывы наших <span className="text-primary">клиентов</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card data-testid="testimonial-1">
            <CardContent className="p-6">
              <div className="mb-4 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                "Продала квартиру за 2 недели без риелтора. Сервис проверки покупателя очень помог — 
                сразу видно, что человек надёжный. Сэкономила 300 тысяч на комиссии!"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  АМ
                </div>
                <div>
                  <div className="font-medium">Анна М.</div>
                  <div className="text-sm text-muted-foreground">Москва</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="testimonial-2">
            <CardContent className="p-6">
              <div className="mb-4 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                "Купили квартиру в ипотеку через платформу. Калькулятор подобрал лучшую ставку, 
                а юрист проверил все документы. Очень удобно и прозрачно!"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  ДК
                </div>
                <div>
                  <div className="font-medium">Дмитрий К.</div>
                  <div className="text-sm text-muted-foreground">Санкт-Петербург</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="testimonial-3">
            <CardContent className="p-6">
              <div className="mb-4 flex gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                "Генератор документов — просто спасение! Раньше тратил на юриста 20-30 тысяч, 
                а тут всё готово за пару минут. Рекомендую всем."
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  СВ
                </div>
                <div>
                  <div className="font-medium">Сергей В.</div>
                  <div className="text-sm text-muted-foreground">Казань</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
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
                asChild
                data-testid="button-cta-register"
              >
                <Link href="/register">Создать аккаунт</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
