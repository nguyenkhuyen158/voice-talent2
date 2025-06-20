import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { HeroData } from '../../data/hero';

export async function getHeroData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/hero`);
  if (!res.ok) throw new Error('Failed to fetch hero data');
  const data = await res.json();
  return data.hero;
}

export default async function Hero() {
  const heroData: HeroData = await getHeroData();

  return (
    <section id="hero" className="scroll-section min-h-screen flex items-center justify-center relative pt-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto px-6 text-center relative z-10"
      >
        {heroData && (
          <>
            <div className="mb-8 floating">
              <img
                src={heroData.photo}
                alt="Voice Talent"
                className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-white/10 shadow-2xl"
              />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
              {heroData.title.line1}
              <br />
              {heroData.title.line2}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
              {heroData.description}
            </p>
          </>
        )}
        
        {/* Sound wave animation */}
        <div className="flex justify-center mb-12">
          <div className="sound-wave">
            {[...Array(8)].map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {heroData && (
            <>
              <a
                href="#projects"
                className="glass-card px-8 py-4 text-lg flex items-center justify-center gap-2 hover:text-blue-300"
              >
                <PlayCircleIcon className="w-6 h-6" />
                {heroData.buttons.demo.text}
              </a>
              <a 
                href="#contact" 
                className="glass-card px-8 py-4 text-lg flex items-center justify-center gap-2 hover:text-green-300"
              >
                <EnvelopeIcon className="w-6 h-6" />
                {heroData.buttons.contact.text}
              </a>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
