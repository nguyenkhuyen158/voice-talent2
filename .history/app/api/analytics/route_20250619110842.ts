import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';

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

// Calculate daily stats with unique IP and session tracking
const calculateDailyStats = (visits: Visit[]): DailyStats[] => {
  const dailyStats = new Map<string, {
    visits: number;
    uniqueAgents: Set<string>;
    uniqueIPs: Set<string>;
    uniqueSessions: Set<string>;
  }>();
  
  visits.forEach(visit => {
    const date = new Date(visit.timestamp).toISOString().split('T')[0];
    if (!dailyStats.has(date)) {
      dailyStats.set(date, {
        visits: 0,
        uniqueAgents: new Set(),
        uniqueIPs: new Set(),
        uniqueSessions: new Set()
      });
    }

    const stats = dailyStats.get(date)!;
    stats.visits++;
    if (visit.userAgent) stats.uniqueAgents.add(visit.userAgent);
    if (visit.ip) stats.uniqueIPs.add(visit.ip);
    if (visit.sessionId) stats.uniqueSessions.add(visit.sessionId);
  });

  return Array.from(dailyStats.entries())
    .map(([date, stats]) => ({
      date,
      visits: stats.visits,
      uniqueVisits: stats.uniqueAgents.size,
      uniqueIPVisits: stats.uniqueIPs.size,
      uniqueSessionVisits: stats.uniqueSessions.size
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

// Check if a visit should be counted as unique
const shouldCountVisit = (analytics: AnalyticsData, ip: string, sessionId: string): boolean => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const todayVisits = analytics.visits.filter(v => v.timestamp.startsWith(today));
  
  // Kiểm tra xem IP này đã truy cập trong ngày chưa
  const hasIPVisited = todayVisits.some(v => v.ip === ip);
  
  // Kiểm tra xem session này đã truy cập trong ngày chưa
  const hasSessionVisited = todayVisits.some(v => v.sessionId === sessionId);
  
  // Chỉ tính là lượt truy cập mới nếu cả IP và session đều chưa truy cập trong ngày
  return !hasIPVisited || !hasSessionVisited;
};

// GET /api/analytics
export async function GET() {
  try {
    const analytics = getAnalytics();
    const dailyStats = calculateDailyStats(analytics.visits);
    
    const today = dailyStats.find(stat => 
      stat.date === new Date().toISOString().split('T')[0]
    ) || {
      visits: 0,
      uniqueVisits: 0,
      uniqueIPVisits: 0,
      uniqueSessionVisits: 0
    };

    return NextResponse.json({
      totalVisits: analytics.visits.length,
      totalUniqueIPs: new Set(analytics.visits.map(v => v.ip)).size,
      totalUniqueSessions: new Set(analytics.visits.map(v => v.sessionId)).size,
      dailyStats: dailyStats.slice(0, 30), // Last 30 days
      today
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}

// POST /api/analytics
export async function POST(request: Request) {
  try {
    const headersList = headers();
    const ip = headersList.get('x-visitor-ip') || 'unknown';
    const sessionId = headersList.get('x-visitor-session') || 'unknown';
    const body = await request.json();
    
    const analytics = getAnalytics();

    // Kiểm tra xem có nên tính là lượt truy cập mới không
    if (!shouldCountVisit(analytics, ip, sessionId)) {
      return NextResponse.json({ success: true, counted: false });
    }
    
    // Add new visit
    const visit: Visit = {
      timestamp: new Date().toISOString(),
      page: body.page || '/',
      userAgent: body.userAgent,
      ip,
      sessionId
    };

    analytics.visits.push(visit);
    
    // Update daily stats
    analytics.dailyStats = calculateDailyStats(analytics.visits);
    
    // Save data
    if (!saveAnalytics(analytics)) {
      throw new Error('Failed to save analytics');
    }

    return NextResponse.json({ success: true, counted: true });
  } catch (error) {
    console.error('Error recording visit:', error);
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}
