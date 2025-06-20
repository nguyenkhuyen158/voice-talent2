import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Partner } from '@/data/partners';

const partnersPath = path.join(process.cwd(), 'data', 'partners.json');

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(partnersPath, 'utf8'));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { partner } = await req.json();
    const data = JSON.parse(fs.readFileSync(partnersPath, 'utf8'));
    
    // Tạo ID mới
    const maxId = Math.max(...data.partners.map((p: Partner) => parseInt(p.id)));
    const newPartner = { ...partner, id: (maxId + 1).toString() };
    
    data.partners.push(newPartner);
    fs.writeFileSync(partnersPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, partner: newPartner });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { partner, id } = await req.json();
    const data = JSON.parse(fs.readFileSync(partnersPath, 'utf8'));
    
    const index = data.partners.findIndex((p: Partner) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }
    
    data.partners[index] = { ...partner, id };
    fs.writeFileSync(partnersPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, partner: data.partners[index] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const data = JSON.parse(fs.readFileSync(partnersPath, 'utf8'));
    
    const index = data.partners.findIndex((p: Partner) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Partner not found' },
        { status: 404 }
      );
    }
    
    data.partners.splice(index, 1);
    fs.writeFileSync(partnersPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete partner' },
      { status: 500 }
    );
  }
}
