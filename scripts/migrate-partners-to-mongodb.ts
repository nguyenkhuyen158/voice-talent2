import { Partner } from '../data/tmp/partners';
import fs from 'fs';
import path from 'path';
import clientPromise from '../lib/mongodb';

async function migrate() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'partners.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const partners: Partner[] = json.partners;

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Partner>('partners');

  // Remove all old data first (optional)
  await collection.deleteMany({});
  // Insert all partners
  await collection.insertMany(partners);
  console.log('Migrated partners to MongoDB:', partners.length);
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
