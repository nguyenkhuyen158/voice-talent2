import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'tmp', 'analytics.json');

// Helper function to log errors
const logError = (error: any, context: string) => {
  console.error(`Analytics Error (${context}):`, {
    message: error.message,
    stack: error.stack,
    time: new Date().toISOString()
  });
};

// Ensure directory exists
const ensureDirectory = async () => {
  try {
    const dir = path.dirname(ANALYTICS_FILE);
    await fs.mkdir(dir, { recursive: true });
    return true;
  } catch (error) {
    logError(error, 'ensureDirectory');
    return false;
  }
};

// Initialize analytics file with proper structure
const initAnalyticsFile = async (): Promise<boolean> => {
  try {
    await ensureDirectory();
    
    try {
      await fs.access(ANALYTICS_FILE);
      // File exists, verify its structure
      const content = await fs.readFile(ANALYTICS_FILE, 'utf-8');
      const data = JSON.parse(content);
      
      if (!data.visits || !Array.isArray(data.visits) || !data.dailyStats || !Array.isArray(data.dailyStats)) {
        throw new Error('Invalid file structure');
      }
    } catch (error) {
      // File doesn't exist or is invalid, create new one
      const initialData: AnalyticsData = {
        visits: [],
        dailyStats: []
      };
      await fs.writeFile(ANALYTICS_FILE, JSON.stringify(initialData, null, 2));
    }
    return true;
  } catch (error) {
    logError(error, 'initAnalyticsFile');
    return false;
  }
};

// Get analytics data
const getAnalytics = async (): Promise<AnalyticsData> => {
  try {
    await initAnalyticsFile();
    const content = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    logError(error, 'getAnalytics');
    return { visits: [], dailyStats: [] };
  }
};

// Save analytics data
const saveAnalytics = async (data: AnalyticsData): Promise<boolean> => {
  try {
    await ensureDirectory();
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    logError(error, 'saveAnalytics');
    return false;
  }
};

// Calculate daily stats with full error handling
const calculateDailyStats = (visits: Visit[]): DailyStats[] => {
  try {
    const dailyStats = new Map<string, {
      visits: number;
      uniqueAgents: Set<string>;
      uniqueIPs: Set<string>;
      uniqueSessions: Set<string>;
    }>();

    visits.forEach(visit => {
      try {
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
      } catch (error) {
        logError(error, 'calculateDailyStats - processing visit');
      }
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
  } catch (error) {
    logError(error, 'calculateDailyStats');
    return [];
  }
};

// GET /api/analytics
export async function GET() {
  try {
    const analytics = await getAnalytics();
    const dailyStats = calculateDailyStats(analytics.visits);
    const today = new Date().toISOString().split('T')[0];

    return NextResponse.json({
      success: true,
      totalVisits: analytics.visits.length,
      totalUniqueIPs: new Set(analytics.visits.map(v => v.ip)).size,
      totalUniqueSessions: new Set(analytics.visits.map(v => v.sessionId)).size,
      dailyStats: dailyStats.slice(0, 30), // Last 30 days
      today: dailyStats.find(stat => stat.date === today) || {
        date: today,
        visits: 0,
        uniqueVisits: 0,
        uniqueIPVisits: 0,
        uniqueSessionVisits: 0
      }
    });
  } catch (error) {
    logError(error, 'GET');
    return NextResponse.json({
      success: false,
      error: 'Failed to get analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/analytics
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analytics = await getAnalytics();

    const visit: Visit = {
      timestamp: new Date().toISOString(),
      page: body.page || '/',
      userAgent: body.userAgent,
      ip: body.ip || 'unknown',
      sessionId: body.sessionId || 'unknown'
    };

    analytics.visits.push(visit);
    analytics.dailyStats = calculateDailyStats(analytics.visits);

    const success = await saveAnalytics(analytics);
    if (!success) {
      throw new Error('Failed to save analytics');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError(error, 'POST');
    return NextResponse.json({
      success: false,
      error: 'Failed to record visit',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
