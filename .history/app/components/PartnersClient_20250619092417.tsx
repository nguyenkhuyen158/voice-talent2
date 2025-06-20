'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Partner } from '../../data/partners';

interface PartnersClientProps {
  partners: Partner[];
  onSelectPartner: (description: string) => void;
}

export default function PartnersClient({ partners, onSelectPartner }: PartnersClientProps) {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Đối Tác Của Chúng Tôi</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Tự hào hợp tác cùng các thương hiệu hàng đầu
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => onSelectPartner(partner.description)}
              className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="aspect-w-16 aspect-h-9 relative mb-4">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
              <p className="text-white/60 text-sm">{partner.field}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
