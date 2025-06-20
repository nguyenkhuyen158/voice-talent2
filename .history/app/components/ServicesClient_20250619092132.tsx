'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Service } from '../../data/services';

interface ServicesClientProps {
  services: Service[];
}

export default function ServicesClient({ services }: ServicesClientProps) {
  return (
    <section id="services" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Dịch Vụ Của Chúng Tôi</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Cung cấp đa dạng các dịch vụ thu âm, lồng tiếng chuyên nghiệp
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={24}
                  height={24}
                  className="opacity-70"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-white/60 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
