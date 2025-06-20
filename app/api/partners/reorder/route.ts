import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { partners } = await req.json();
    const partnersPath = path.join(process.cwd(), 'data', 'partners.json');
    
    fs.writeFileSync(partnersPath, JSON.stringify({ partners }, null, 2));
    
    return NextResponse.json({ success: true, partners });
  } catch (error) {
    console.error('Error reordering partners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder partners' },
      { status: 500 }
    );
  }
}
