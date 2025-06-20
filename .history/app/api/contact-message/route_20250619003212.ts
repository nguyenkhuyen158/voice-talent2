import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'contact-messages.json');

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
    } catch {}
    const newMsg = { name, email, message, to, createdAt: new Date().toISOString() };
    messages.push(newMsg);
    await fs.writeFile(dataFilePath, JSON.stringify(messages, null, 2));

    // Gửi email (giả lập, thực tế cần tích hợp SMTP hoặc dịch vụ email)
    // Ở đây chỉ trả về thành công, bạn có thể tích hợp nodemailer nếu muốn gửi thật
    // await sendMail({ from: email, to, subject: `Liên hệ từ ${name}`, text: message });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
