import fs from 'fs';
import path from 'path';
import clientPromise from '../lib/mongodb';

async function migrateAnalytics() {
  const filePath = path.join(process.cwd(), 'data', 'tmp', 'analytics.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('analytics');
  await collection.deleteMany({});
  await collection.insertOne(json);
  console.log('Migrated analytics data to MongoDB');
  process.exit(0);
}

migrateAnalytics().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
