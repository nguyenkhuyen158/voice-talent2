'use client';

import { useState } from 'react';
import Hero from './Hero';
import Projects from './Projects';
import Contact from './Contact';
import Navigation from './Navigation';
import Footer from './Footer';
import ServicesClient from './ServicesClient';
import PartnersClient from './PartnersClient';
import type { Service } from '../../data/services';
import type { Partner } from '../../data/partners';
import type { Project } from '../../data/projects';

interface HomeClientProps {
  services: Service[];
  partners: Partner[];
  projects: Project[];
}

export default function HomeClient({ services, partners, projects }: HomeClientProps) {
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
      <Projects 
        projects={projects}
        selectedPartner={selectedPartner} 
        onChangeFilter={setVoiceFilter} 
      />
      <div id="partners">
        <PartnersClient 
          partners={partners}
          onSelectPartner={(description: string) => {
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
