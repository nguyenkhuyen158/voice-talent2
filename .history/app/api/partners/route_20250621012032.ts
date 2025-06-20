import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Partner } from '@/data/tmp/partners';

// Helper function to get the collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Partner>('partners');
}

export async function GET() {
  try {
    const collection = await getCollection();
    const partners = await collection.find().toArray();
    return NextResponse.json({ partners });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { partner } = await req.json();
    const collection = await getCollection();
    // Tạo ID mới
    const max = await collection.find().sort({ id: -1 }).limit(1).toArray();
    let newId = '1';
    if (max.length > 0 && !isNaN(Number(max[0].id))) {
      newId = (parseInt(max[0].id) + 1).toString();
    }
    const newPartner = { ...partner, id: newId };
    await collection.insertOne(newPartner);
    return NextResponse.json({ success: true, partner: newPartner });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { partner, id } = await req.json();
    const collection = await getCollection();
    const result = await collection.updateOne({ id }, { $set: { ...partner, id } });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }
    const updated = await collection.findOne({ id });
    return NextResponse.json({ success: true, partner: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const collection = await getCollection();
    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete partner' },
      { status: 500 }
    );
  }
}
