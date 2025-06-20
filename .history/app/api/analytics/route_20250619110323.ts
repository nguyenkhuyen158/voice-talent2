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

interface AnalyticsData {
  visits: Visit[];
  dailyStats: DailyStats[];
}

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Ensure analytics file exists with proper structure
const initAnalyticsFile = () => {
  if (!fs.existsSync(ANALYTICS_FILE)) {
    const initialData: AnalyticsData = {
      visits: [],
      dailyStats: []
    };
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initialData, null, 2));
  } else {
    try {
      const data = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
      JSON.parse(data);
    } catch (error) {
      console.error('Invalid analytics.json file, resetting...');
      const initialData: AnalyticsData = {
        visits: [],
        dailyStats: []
      };
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initialData, null, 2));
    }
  }
};

// Get analytics data with error handling
const getAnalytics = (): AnalyticsData => {
  try {
    initAnalyticsFile();
    const data = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading analytics file:', error);
    return { visits: [], dailyStats: [] };
  }
};

// Save analytics data with error handling
const saveAnalytics = (data: AnalyticsData) => {
  try {
    const dirPath = path.dirname(ANALYTICS_FILE);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving analytics:', error);
    return false;
  }
};

// Calculate daily stats with support for date ranges
const calculateDailyStats = (visits: Visit[]): DailyStats[] => {
  const dailyVisits = new Map<string, Set<string>>();
  
  visits.forEach(visit => {
    const date = new Date(visit.timestamp).toISOString().split('T')[0];
    if (!dailyVisits.has(date)) {
      dailyVisits.set(date, new Set());
    }
    dailyVisits.get(date)?.add(visit.userAgent || 'unknown');
  });

  return Array.from(dailyVisits.entries())
    .map(([date, uniqueVisitors]) => ({
      date,
      visits: visits.filter(v => v.timestamp.startsWith(date)).length,
      uniqueVisits: uniqueVisitors.size
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

// GET /api/analytics
export async function GET() {
  try {
    const analytics = getAnalytics();
    const dailyStats = calculateDailyStats(analytics.visits);
    
    return NextResponse.json({
      totalVisits: analytics.visits.length,
      dailyStats: dailyStats.slice(0, 30), // Last 30 days
      today: dailyStats.find(stat => 
        stat.date === new Date().toISOString().split('T')[0]
      ) || { visits: 0, uniqueVisits: 0 }
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
    
    // Add new visit
    const visit: Visit = {
      timestamp: new Date().toISOString(),
      page: body.page || '/',
      userAgent: body.userAgent
    };

    analytics.visits.push(visit);
    
    // Update daily stats
    analytics.dailyStats = calculateDailyStats(analytics.visits);
    
    // Save data
    if (!saveAnalytics(analytics)) {
      throw new Error('Failed to save analytics');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording visit:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}
