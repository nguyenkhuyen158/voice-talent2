import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { projects } = await req.json();
    const projectsPath = path.join(process.cwd(), 'data', 'projects.json');
    
    // Đọc file hiện tại để giữ lại các dự án không thay đổi
    const currentData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    
    // Cập nhật thứ tự mới
    fs.writeFileSync(projectsPath, JSON.stringify({ projects }, null, 2));
    
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder projects' },
      { status: 500 }
    );
  }
}
