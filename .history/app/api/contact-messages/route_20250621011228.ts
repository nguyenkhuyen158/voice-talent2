import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import type { ContactMessage } from '../../../data/tmp/contact-messages';

const dataFilePath = path.join(process.cwd(), 'data', 'tmp', 'contact-messages.json');

// Helper function to read messages
async function readMessages(): Promise<{ messages: ContactMessage[] }> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    const messages = JSON.parse(data);
    // If the file contains an array, convert it to the new format
    if (Array.isArray(messages)) {
      return { messages };
    }
    return messages;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      const initialData = { messages: [] };
      await fs.writeFile(dataFilePath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    throw error;
  }
}

// Helper function to write messages
async function writeMessages(data: { messages: ContactMessage[] }): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});

interface EmailRequest {
  from: string;
  to: string;
  subject: string;
  text: string;
}

async function sendEmail({ from, to, subject, text }: EmailRequest): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Voice Talent Contact" <${process.env.SMTP_USER}>`,
      replyTo: from,
      to,
      subject,
      text,
      html: `
        <h2>Tin nhắn liên hệ mới</h2>
        <p><strong>Từ:</strong> ${from}</p>
        <p><strong>Nội dung:</strong></p>
        <p>${text.replace(/\n/g, '<br>')}</p>
      `,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
  to: string;
}

// GET /api/contact-messages
export async function GET() {
  try {
    const data = await readMessages();
    // Sort messages newest first
    data.messages.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' }, 
      { status: 500 }
    );
  }
}

// POST /api/contact-messages - Create new message
export async function POST(req: Request) {
  try {
    const { name, email, message, to } = await req.json();
    
    if (!name || !email || !message || !to) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const data = await readMessages();
    const newMessage: ContactMessage = {
      id: uuidv4(),
      name,
      email,
      message,
      to,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    data.messages.push(newMessage);
    await writeMessages(data);

    // Send email
    const emailSent = await sendEmail({
      from: email,
      to,
      subject: `[Voice Talent] Liên hệ từ ${name}`,
      text: message,
    });

    if (!emailSent) {
      console.log('Email sending failed');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to add message:', error);
    return NextResponse.json(
      { error: 'Failed to add message' }, 
      { status: 500 }
    );
  }
}

// PUT /api/contact-messages - Update message
export async function PUT(req: Request) {
  try {
    const { id, isRead } = await req.json();
    const data = await readMessages();
    
    const index = data.messages.findIndex(m => m.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Message not found' }, 
        { status: 404 }
      );
    }

    data.messages[index] = {
      ...data.messages[index],
      isRead
    };

    await writeMessages(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/contact-messages
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    console.log('Deleting message with ID:', id);
    
    const data = await readMessages();
    console.log('Current messages count:', data.messages.length);
    
    data.messages = data.messages.filter(m => m.id !== id);
    console.log('Messages count after filter:', data.messages.length);
    
    await writeMessages(data);
    console.log('Messages written to file');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' }, 
      { status: 500 }
    );
  }
}
