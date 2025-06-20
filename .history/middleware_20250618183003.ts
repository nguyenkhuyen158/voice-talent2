import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('admin_token')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminPage) {
    // Nếu chưa đăng nhập và không phải trang login, redirect về trang login
    if (!isLoggedIn && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Nếu đã đăng nhập và đang ở trang login, redirect về dashboard
    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
