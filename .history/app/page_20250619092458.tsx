import HomeClient from './components/HomeClient';
import { headers } from 'next/headers';

async function getServices() {
  const headersList = headers();
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('host') || '';
  const baseUrl = `${protocol}://${host}`;
  
  const res = await fetch(`${baseUrl}/api/services`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch services');
  const data = await res.json();
  return data.services;
}

async function getPartners() {
  const headersList = headers();
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const host = headersList.get('host') || '';
  const baseUrl = `${protocol}://${host}`;
  
  const res = await fetch(`${baseUrl}/api/partners`, {
    cache: 'no-store'
  });
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
