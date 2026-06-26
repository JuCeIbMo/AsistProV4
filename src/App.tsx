import { useState } from 'react';
import PricingModal from './components/PricingModal';
import type { PricingPlan } from './components/landing/content';
import {
  useChatPlayback,
  useScrollReveal,
  useStickyHeaderOffset,
} from './components/landing/hooks';
import {
  ClosingSection,
  FeaturesSection,
  HeroSection,
  LandingHeader,
  MethodSection,
  PricingSection,
  ProofSection,
  SiteFooter,
} from './components/landing/sections';
import { buildWhatsAppUrl } from './config/whatsapp';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const scrolled = useStickyHeaderOffset();
  const { visibleCount, isTyping } = useChatPlayback();

  useScrollReveal();

  const openModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const whatsappRedirect = () => window.open(buildWhatsAppUrl(), '_blank');

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ color: '#1A1816' }}>
      <LandingHeader
        isMenuOpen={isMenuOpen}
        scrolled={scrolled}
        onToggleMenu={() => setIsMenuOpen(current => !current)}
      />

      <main>
        <HeroSection
          visibleCount={visibleCount}
          isTyping={isTyping}
          onWhatsAppRedirect={whatsappRedirect}
        />
        <ProofSection />
        <FeaturesSection />
        <MethodSection />
        <PricingSection
          isAnnual={isAnnual}
          onOpenPlan={openModal}
          onToggleAnnual={() => setIsAnnual(current => !current)}
        />
        <ClosingSection onWhatsAppRedirect={whatsappRedirect} />
      </main>

      <SiteFooter />

      <PricingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
        isAnnual={isAnnual}
      />
    </div>
  );
}

export default App;
