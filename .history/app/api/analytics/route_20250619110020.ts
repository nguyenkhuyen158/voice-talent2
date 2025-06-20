import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Visit {
  timestamp: string;
  page: string;
  userAgent?: string;
}

interface DailyStats {
  date: string;
  visits: number;
  uniqueVisits: number;
}

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Ensure analytics file exists
const initAnalyticsFile = () => {
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({ visits: [], dailyStats: [] }));
  }
};

// Get analytics data
const getAnalytics = () => {
  initAnalyticsFile();
  const data = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Save analytics data
const saveAnalytics = (data: any) => {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
};

// Calculate daily stats
const calculateDailyStats = (visits: Visit[]): DailyStats[] => {
  const dailyVisits = new Map<string, Set<string>>();
  
  visits.forEach(visit => {
    const date = new Date(visit.timestamp).toISOString().split('T')[0];
    if (!dailyVisits.has(date)) {
      dailyVisits.set(date, new Set());
    }
    dailyVisits.get(date)?.add(visit.userAgent || 'unknown');
  });

  return Array.from(dailyVisits.entries()).map(([date, uniqueVisitors]) => ({
    date,
    visits: visits.filter(v => v.timestamp.startsWith(date)).length,
    uniqueVisits: uniqueVisitors.size
  })).sort((a, b) => b.date.localeCompare(a.date));
};

// GET /api/analytics
export async function GET() {
  try {
    const analytics = getAnalytics();
    const dailyStats = calculateDailyStats(analytics.visits);
    
    return NextResponse.json({
      totalVisits: analytics.visits.length,
      dailyStats: dailyStats.slice(0, 30) // Last 30 days
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}

// POST /api/analytics
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analytics = getAnalytics();
    
    const visit: Visit = {
      timestamp: new Date().toISOString(),
      page: body.page || '/',
      userAgent: body.userAgent
    };

    analytics.visits.push(visit);
    saveAnalytics(analytics);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording visit:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}
