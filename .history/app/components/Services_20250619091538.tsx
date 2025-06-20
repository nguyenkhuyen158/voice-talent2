import Image from 'next/image';
import { motion } from 'framer-motion';
import { Service } from '../../data/services';

async function getServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  const data = await res.json();
  return data.services;
}

export default async function Services() {
  const services: Service[] = await getServices();

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Cung cấp đa dạng các dịch vụ thu âm, lồng tiếng chuyên nghiệp
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center mb-4 group-hover:from-blue-800/40 group-hover:to-purple-800/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={32}
                    height={32}
                    className="relative z-10 brightness-150 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] [filter:drop-shadow(0_0_8px_rgba(59,130,246,0.4))] group-hover:[filter:drop-shadow(0_0_12px_rgba(147,51,234,0.5))]"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-white/70 mb-4 line-clamp-2">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="rounded-full w-1.5 h-1.5 bg-blue-500/50 mt-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
