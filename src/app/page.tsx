import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import PortfolioSection from '@/components/PortfolioSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ParticleSystem from '@/components/ParticleSystem';

export default function Home() {
  return (
    <div className="relative">
      <ParticleSystem particleCount={75} />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
