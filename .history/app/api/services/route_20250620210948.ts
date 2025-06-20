import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Service } from '@/data/services';

const dataFilePath = path.join(process.cwd(), 'data', 'services.json');

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { service } = await req.json();
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Add new service with unique ID
    service.id = Date.now().toString();
    data.services.push(service);
    
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { service, id } = await req.json();
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const index = data.services.findIndex((s: Service) => s.id === id);
    if (index !== -1) {
      data.services[index] = { ...service, id };
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
      return NextResponse.json(data);
    }
    
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    data.services = data.services.filter((s: Service) => s.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
  