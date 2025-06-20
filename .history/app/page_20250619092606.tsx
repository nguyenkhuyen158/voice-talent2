import HomeClient from './components/HomeClient';
import { headers } from 'next/headers';

function getBaseUrl() {
  const headersList = headers();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = headersList.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

async function getServices() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/services`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch services');
  const data = await res.json();
  return data.services;
}

async function getPartners() {
  const baseUrl = getBaseUrl();
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
