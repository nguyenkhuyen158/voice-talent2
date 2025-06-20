import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Contact } from '@/data/contact';

const contactPath = path.join(process.cwd(), 'data', 'contact.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(contactPath, 'utf8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data: Contact = await req.json();
    fs.writeFileSync(contactPath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update contact info' },
      { status: 500 }
    );
  }
}
