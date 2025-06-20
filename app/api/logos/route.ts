import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logosDir = path.join(process.cwd(), 'public', 'logos');
    const files = fs.readdirSync(logosDir);
    
    // Lọc chỉ lấy file ảnh
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });

    // Thêm đường dẫn tương đối cho mỗi file
    const logos = imageFiles.map(file => ({
      name: file,
      path: `/logos/${file}`
    }));

    return NextResponse.json({ logos });
  } catch (error) {
    console.error('Error getting logos:', error);
    return NextResponse.json({ error: 'Failed to get logos' }, { status: 500 });
  }
}
