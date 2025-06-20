import Image from 'next/image';
import { Partner } from '../../data/tmp/partners';

async function getPartners() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/partners`);
  if (!res.ok) throw new Error('Failed to fetch partners');
  const data = await res.json();
  return data.partners;
}

export default async function Partners({ onSelectPartner }: { onSelectPartner?: (description: string) => void }) {
  const partners: Partner[] = await getPartners();

  return (
    <section id="partners" className="scroll-section py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Khách Hàng Của Chúng Tôi</h2>
        <div className="glass-card p-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="w-full max-w-[200px] aspect-[3/2] glass-card p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform group"
              >
                {onSelectPartner ? (
                  <button
                    onClick={() => onSelectPartner(partner.description)}
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <PartnerContent partner={partner} />
                  </button>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <PartnerContent partner={partner} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerContent({ partner }: { partner: Partner }) {
  return (
    <>
      <div className="relative w-full h-16 mb-2">
        {partner.logo ? (
          <Image
            src={partner.logo}
            alt={partner.name}
            fill
            className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full bg-white/10 rounded-lg" />
        )}
      </div>
      <span className="text-lg font-semibold text-white/70 text-center group-hover:text-white transition-colors">
        {partner.name}
      </span>
    </>
  );
}
