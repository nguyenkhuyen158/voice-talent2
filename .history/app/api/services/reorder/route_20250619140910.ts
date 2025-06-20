import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'services.json');

export async function POST(req: Request) {
  try {
    const { services } = await req.json();
    const data = { services };
    
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder services' }, { status: 500 });
  }
}
