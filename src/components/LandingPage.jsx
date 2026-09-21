import React, { useState } from 'react';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import AboutSection from './AboutSection.jsx';
import ServicesSection from './ServicesSection.jsx';
import ProcessSection from './ProcessSection.jsx';
import TestimonialSection from './TestimonialSection.jsx';
import ComparisonSection from './ComparisonSection.jsx';
import FAQSection from './FAQSection.jsx';
import ContactSection from './ContactSection.jsx';
import Footer from './Footer.jsx';
import NetworkModal from './NetworkModal.jsx';

export default function LandingPage({ onEnterPlatform }) {
  const [networkOpen, setNetworkOpen] = useState(false);

  return (
    <>
      <Navbar onEnterPlatform={onEnterPlatform} />
      <main>
        <Hero onRunNetwork={() => setNetworkOpen(true)} onEnterPlatform={onEnterPlatform} />
        <AboutSection onRunNetwork={() => setNetworkOpen(true)} />
        <ServicesSection />
        <ProcessSection />
        <TestimonialSection />
        <ComparisonSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      {networkOpen && <NetworkModal onClose={() => setNetworkOpen(false)} />}
    </>
  );
}
