import { Service } from '../../data/tmp/services';
import ServicesClient from './ServicesClient';

async function getServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  const data = await res.json();
  return data.services;
}

export default async function Services() {
  const services: Service[] = await getServices();
  
  return <ServicesClient services={services} />;
}
