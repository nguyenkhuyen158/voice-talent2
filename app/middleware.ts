import { NextResponse, NextRequest } from 'next/server';

// Hàm để lấy IP thực của client, xử lý cả trường hợp qua proxy
function getClientIP(request: NextRequest): string {
    // Thứ tự ưu tiên để lấy IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const connectionRemote = request.headers.get('connection-remote-address');
    
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    
    if (realIp) {
        return realIp;
    }
    
    if (connectionRemote) {
        return connectionRemote;
    }

    return 'unknown';
}

export function middleware(request: NextRequest) {
    // Tạo response mới thay vì modify response hiện tại
    const response = NextResponse.next({
        request: {
            headers: new Headers(request.headers),
        },
    });

    try {
        // Lấy hoặc tạo session ID
        let sessionId = request.cookies.get('visitor_session')?.value;
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            // Tạo cookie mới
            response.cookies.set('visitor_session', sessionId, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60, // 24 giờ
            });
        }

        // Lấy IP của client
        const clientIP = getClientIP(request);

        // Thêm headers vào response
        response.headers.set('x-visitor-ip', clientIP);
        response.headers.set('x-visitor-session', sessionId);

        return response;
    } catch (error) {
        console.error('Middleware error:', error);
        // Trong trường hợp lỗi, vẫn cho phép request tiếp tục
        return response;
    }
}

// Chỉ áp dụng middleware cho các route chính, không áp dụng cho static files
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
    ],
};
