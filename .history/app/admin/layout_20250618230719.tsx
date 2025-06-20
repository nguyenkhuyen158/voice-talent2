'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  DocumentDuplicateIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  EnvelopeIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: HomeIcon
  },  {
    name: 'Quản lý dự án',
    href: '/admin/projects',
    icon: DocumentDuplicateIcon
  },
  {
    name: 'Quản lý đối tác',
    href: '/admin/partners',
    icon: UsersIcon
  },
  {
    name: 'Quản lý dịch vụ',
    href: '/admin/services',
    icon: Square3Stack3DIcon
  },
  {
    name: 'Quản lý liên hệ',
    href: '/admin/contact',
    icon: EnvelopeIcon
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Đăng xuất thành công');
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      toast.error('Lỗi khi đăng xuất');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Header */}
      <header className="glass-card backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-2 text-sm flex items-center gap-2 glass-card hover:bg-white/5 transition-colors rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              {isLoading ? 'Đang xử lý...' : 'Đăng xuất'}
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[240px,1fr] gap-8">
          <nav className="glass-card p-4 h-fit">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'hover:bg-white/5 text-white/70 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="glass-card p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
