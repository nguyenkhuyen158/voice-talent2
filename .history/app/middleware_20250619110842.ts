import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hàm để lấy IP thực của client, xử lý cả trường hợp qua proxy
function getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    return request.ip || 'unknown';
}

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Lấy hoặc tạo session ID
    let sessionId = request.cookies.get('visitor_session')?.value;
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        response.cookies.set('visitor_session', sessionId, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60, // 24 giờ
        });
    }

    // Thêm IP và session vào headers để API có thể sử dụng
    const clientIP = getClientIP(request);
    response.headers.set('x-visitor-ip', clientIP);
    response.headers.set('x-visitor-session', sessionId);

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
