import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/base/Footer';
import Hero from './Hero';
import Features from './Features';
import Modules from './Modules';
import CTA from './CTA';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-brand-navy-950">
      <PublicNavbar />
      <Hero />
      <Features />
      <Modules />
      <CTA />
      <Footer />
    </div>
  );
}
