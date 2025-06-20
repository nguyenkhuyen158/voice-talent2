import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import type { ContactMessage } from '../../../data/contact-messages';

const dataFilePath = path.join(process.cwd(), 'data', 'contact-messages.json');

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
export async function GET(): Promise<NextResponse> {
  try {
    const messages = await readMessages();
    // Sắp xếp tin nhắn mới nhất lên đầu
    messages.sort((a: ContactMessage, b: ContactMessage) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error reading messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// POST /api/contact-messages
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, email, message, to }: ContactMessageRequest = await req.json();
    
    if (!name || !email || !message || !to) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
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

    // Gửi email 
    const emailSent = await sendEmail({
      from: email,
      to,
      subject: `[Voice Talent] Liên hệ từ ${name}`,
      text: message,
    });

    if (!emailSent) {
      return NextResponse.json({
        success: true,
        warning: 'Message saved but email sending failed'
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
