import HomeClient from './components/HomeClient';

async function getServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  const data = await res.json();
  return data.services;
}

async function getPartners() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/partners`);
  if (!res.ok) throw new Error('Failed to fetch partners');
  const data = await res.json();
  return data.partners;
}

export default async function Home() {
  const [services, partners] = await Promise.all([
    getServices(),
    getPartners()
  ]);
  
  return <HomeClient services={services} partners={partners} />;
}
