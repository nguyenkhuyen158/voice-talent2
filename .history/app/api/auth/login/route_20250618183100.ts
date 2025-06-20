import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Kiểm tra thông tin đăng nhập
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Tạo token đơn giản (trong thực tế nên dùng JWT)
    const token = Buffer.from(`${username}-${Date.now()}`).toString('base64');

    // Set cookie
    cookies().set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi xử lý đăng nhập' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  // Xóa cookie khi logout
  cookies().delete('admin_token');
  return NextResponse.json({ success: true });
}
