import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { ContactMessage } from '../../../../data/contact-messages';

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

// PATCH /api/contact-messages/[id]/route.ts
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { isRead } = await req.json();
    if (typeof isRead !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const messages = await readMessages();
    const messageIndex = messages.findIndex(m => m.id === params.id);
    
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    messages[messageIndex] = {
      ...messages[messageIndex],
      isRead
    };

    await writeMessages(messages);
    return NextResponse.json({ success: true, message: messages[messageIndex] });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/contact-messages/[id]/route.ts
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const messages = await readMessages();
    const messageIndex = messages.findIndex(m => m.id === params.id);
    
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    messages.splice(messageIndex, 1);
    await writeMessages(messages);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
