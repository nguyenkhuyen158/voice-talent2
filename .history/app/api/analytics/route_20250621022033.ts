import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface Visit {
  timestamp: string;
  page: string;
  userAgent?: string;
  ip: string;
  sessionId: string;
}

interface DailyStats {
  date: string;
  visits: number;
  uniqueVisits: number;
  uniqueIPVisits: number;
  uniqueSessionVisits: number;
}

interface AnalyticsData {
  visits: Visit[];
  dailyStats: DailyStats[];
}

// Helper function to get the collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<AnalyticsData>('analytics');
}

// GET analytics
export async function GET() {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne({});
    if (!doc) {
      return NextResponse.json({ visits: [], dailyStats: [] });
    }
    return NextResponse.json({ visits: doc.visits, dailyStats: doc.dailyStats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

// POST analytics (add a visit)
export async function POST(req: Request) {
  try {
    const { visit } = await req.json();
    const collection = await getCollection();
    let doc = await collection.findOne({});
    if (!doc) {
      doc = { visits: [], dailyStats: [] };
      await collection.insertOne(doc);
    }
    // Add new visit
    await collection.updateOne({}, { $push: { visits: visit } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add visit' }, { status: 500 });
  }
}

// PUT analytics (update dailyStats)
export async function PUT(req: Request) {
  try {
    const { dailyStats } = await req.json();
    const collection = await getCollection();
    await collection.updateOne({}, { $set: { dailyStats } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update dailyStats' }, { status: 500 });
  }
}
