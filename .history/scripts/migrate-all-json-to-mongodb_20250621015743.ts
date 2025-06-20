import fs from 'fs';
import path from 'path';
import clientPromise from '../lib/mongodb';
import { Partner } from '../data/tmp/partners';
import { Service } from '../data/tmp/services';
import { Project } from '../data/tmp/projects';
import { ContactData } from '../data/tmp/contact';
import { HeroData } from '../data/tmp/hero';

async function migratePartners() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'partners.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const partners: Partner[] = json.partners;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Partner>('partners');
  await collection.deleteMany({});
  await collection.insertMany(partners);
  console.log('Migrated partners:', partners.length);
}

async function migrateServices() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'services.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const services: Service[] = json.services;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Service>('services');
  await collection.deleteMany({});
  await collection.insertMany(services);
  console.log('Migrated services:', services.length);
}

async function migrateProjects() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'projects.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const projects: Project[] = json.projects;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Project>('projects');
  await collection.deleteMany({});
  await collection.insertMany(projects);
  console.log('Migrated projects:', projects.length);
}

async function migrateContact() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'contact.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const contact: ContactData = json.contact;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<{ contact: ContactData }>('contact_info');
  await collection.deleteMany({});
  await collection.insertOne({ contact });
  console.log('Migrated contact info');
}

async function migrateHero() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'hero.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const hero: HeroData = json.hero;
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<{ hero: HeroData }>('hero_info');
  await collection.deleteMany({});
  await collection.insertOne({ hero });
  console.log('Migrated hero info');
}

async function main() {
  await migratePartners();
  await migrateServices();
  await migrateProjects();
  await migrateContact();
  await migrateHero();
  console.log('All data migrated to MongoDB!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
