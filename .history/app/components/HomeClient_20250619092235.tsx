'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import type { Services } from '../data/services';
import type { Partners } from '../data/partners';

interface HomeClientProps {
  services: Services;
  partners: Partners;
}

export default function HomeClient({ services, partners }: HomeClientProps) {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [voiceFilter, setVoiceFilter] = useState('all');

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-multiply z-0" />
      
      <Navigation />
      <Hero />
      <div id="services">
        <ServicesClient services={services} />
      </div>
      <Projects selectedPartner={selectedPartner} onChangeFilter={setVoiceFilter} />
      <div id="partners">
        <PartnersClient 
          partners={partners}
          onSelectPartner={(description) => {
            setSelectedPartner(description);
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
              projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }} 
        />
      </div>
      <Contact />
      <Footer />
    </div>
  );
}
