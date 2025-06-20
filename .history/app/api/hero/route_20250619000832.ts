import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'hero.json');

export async function GET() {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read hero data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero data' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.hero) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ message: 'Hero data updated successfully' });
  } catch (error) {
    console.error('Failed to update hero data:', error);
    return NextResponse.json(
      { error: 'Failed to update hero data' },
      { status: 500 }
    );
  }
}
