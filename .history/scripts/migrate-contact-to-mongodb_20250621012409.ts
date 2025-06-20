import fs from 'fs';
import path from 'path';
import clientPromise from '../lib/mongodb';
import { ContactData } from '../data/tmp/contact';

async function migrate() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'contact.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const contact: ContactData = json.contact;

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<{ contact: ContactData }>('contact_info');

  // Remove all old data first (optional)
  await collection.deleteMany({});
  // Insert contact info
  await collection.insertOne({ contact });
  console.log('Migrated contact info to MongoDB');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
