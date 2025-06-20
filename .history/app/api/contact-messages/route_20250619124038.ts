import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ContactMessage } from '../../../../data/contact-messages';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'data', 'contact-messages.json');

// Helper function to read messages
async function readMessages() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
}

// Helper function to write messages
async function writeMessages(messages: ContactMessage[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(messages, null, 2));
}

// GET /api/contact-messages
export async function GET() {
  try {
    const messages = await readMessages();
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error reading messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/contact-messages
export async function POST(req: Request) {
  try {
    const { name, email, message, to } = await req.json();
    if (!name || !email || !message || !to) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const messages = await readMessages();
    const newMessage: ContactMessage = {
      id: uuidv4(),
      name,
      email,
      message,
      to,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    messages.push(newMessage);
    await writeMessages(messages);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
