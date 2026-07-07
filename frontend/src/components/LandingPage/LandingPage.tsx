import CTASection from './CTASection';
import FeaturesSection from './FeaturesSection';
import Footer from './Footer';
import HeroSection from './HeroSection';
import NavBarLind from './NavBarLind';
import ServicesSection from './ServicesSection';
import WorksSection from './WorksSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBarLind />
      <HeroSection />
      <WorksSection />
      <ServicesSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
