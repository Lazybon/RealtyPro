import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Search, FileText } from 'lucide-react';

const heroImage = '/images/modern_luxury_apartm_1ebc8f0f.jpg';

export function HeroSection() {
  return (
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
            <Button size="lg" asChild data-testid="button-find-apartment">
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Найти квартиру
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild data-testid="button-make-deal">
              <Link href="/services">
                <FileText className="mr-2 h-4 w-4" />
                Оформить сделку
              </Link>
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
  );
}
