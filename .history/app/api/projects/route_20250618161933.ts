import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Đọc file JSON
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/projects.json', 'utf8');
    const projects = JSON.parse(fileContents);

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load projects' },
      { status: 500 }
    );
  }
}
