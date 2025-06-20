import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ContactData } from '@/data/tmp/contact';

// Helper function to get the collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<{ contact: ContactData }>('contact_info');
}

export async function GET() {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne({});
    if (!doc) {
      return NextResponse.json({ error: 'No contact info found' }, { status: 404 });
    }
    return NextResponse.json({ contact: doc.contact });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data: ContactData = await req.json();
    const collection = await getCollection();
    // Always keep only one document
    await collection.deleteMany({});
    await collection.insertOne({ contact: data });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}
