'use client';

import { useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

export default function Home() {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [voiceFilter, setVoiceFilter] = useState('all');

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-multiply z-0" />
      
      <Navigation />
      <Hero />
      <Services />
      <Projects selectedPartner={selectedPartner} onChangeFilter={setVoiceFilter} />
      <Partners onSelectPartner={(description) => {
        setSelectedPartner(description);
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }} />
      <Contact />
      <Footer />
    </div>
  );
}
