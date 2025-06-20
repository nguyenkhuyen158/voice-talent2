import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const dataFilePath = path.join(process.cwd(), 'data', 'contact-messages.json');

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});

async function sendEmail({ from, to, subject, text }: { 
  from: string;
  to: string;
  subject: string;
  text: string;
}) {
  try {
    await transporter.sendMail({
      from: `"Voice Talent Contact" <${process.env.SMTP_USER}>`, // Always use verified sender
      replyTo: from, // Set reply-to as the contact person's email
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

export async function POST(req: Request) {
  try {
    const { name, email, message, to } = await req.json();
    if (!name || !email || !message || !to) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Lưu vào file json
    let messages: any[] = [];
    try {
      const file = await fs.readFile(dataFilePath, 'utf8');
      messages = JSON.parse(file);
    } catch (err: any) {
      // Nếu file chưa tồn tại, tạo file mới với mảng rỗng
      if (err.code === 'ENOENT') {
        await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
        messages = [];
      } else {
        throw err;
      }
    }

    const newMsg = { 
      id: uuidv4(),
      name, 
      email, 
      message, 
      to, 
      createdAt: new Date().toISOString(),
      isRead: false
    };
    messages.push(newMsg);
    await fs.writeFile(dataFilePath, JSON.stringify(messages, null, 2));

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
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
