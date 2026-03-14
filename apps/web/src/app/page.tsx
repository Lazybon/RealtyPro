'use client';

import { Header } from '@/components/header';
import { Home as HomeIcon } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedListings } from '@/components/home/featured-listings';
import { SecuritySection, ServicesSection } from '@/components/home/services-section';
import { StatsSection, AdvantagesSection, TestimonialsSection, CTASection } from '@/components/home/stats-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeaturedListings />
        <SecuritySection />
        <ServicesSection />
        <StatsSection />
        <AdvantagesSection />
        <TestimonialsSection />
        <CTASection />
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
