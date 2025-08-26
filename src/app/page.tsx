import { lazy } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ParticleSystem from '@/components/ParticleSystem';
import LazySection from '@/components/LazySection';

// Lazy load sections that are below the fold
const AboutSection = lazy(() => import('@/components/AboutSection'));
const PortfolioSection = lazy(() => import('@/components/PortfolioSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));

export default function Home() {
  return (
    <div className="relative">
      <ParticleSystem particleCount={75} />
      <Navigation />
      <HeroSection />
      
      <LazySection>
        <AboutSection />
      </LazySection>
      
      <LazySection>
        <PortfolioSection />
      </LazySection>
      
      <LazySection>
        <ContactSection />
      </LazySection>
      
      <LazySection>
        <Footer />
      </LazySection>
    </div>
  );
}
