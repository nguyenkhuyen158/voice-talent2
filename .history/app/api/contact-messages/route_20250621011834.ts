import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import type { ContactMessage } from '../../../data/tmp/contact-messages';
import nodemailer from 'nodemailer';

// Helper function to get the collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<ContactMessage>('contact_messages');
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

// GET /api/contact-messages
export async function GET() {
  try {
    const collection = await getCollection();
    const messages = await collection.find().sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ messages });
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
    const newMessage: ContactMessage = {
      id: uuidv4(),
      name,
      email,
      message,
      to,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    const collection = await getCollection();
    await collection.insertOne(newMessage);
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
    return NextResponse.json({ message: newMessage });
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
    const collection = await getCollection();
    const result = await collection.updateOne({ id }, { $set: { isRead } });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    const updated = await collection.findOne({ id });
    return NextResponse.json({ message: updated });
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
    const collection = await getCollection();
    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
