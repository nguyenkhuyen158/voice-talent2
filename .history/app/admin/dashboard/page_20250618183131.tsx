'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  BuildingOfficeIcon,
  DocumentDuplicateIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const menuItems = [
    {
      name: 'Quản lý dự án',
      href: '/admin',
      icon: DocumentDuplicateIcon,
      description: 'Thêm, sửa, xóa và sắp xếp thứ tự dự án'
    },
    {
      name: 'Quản lý đối tác',
      href: '/admin/partners',
      icon: UsersIcon,
      description: 'Thêm, sửa, xóa và sắp xếp thứ tự đối tác'
    },
    {
      name: 'Quản lý liên hệ',
      href: '/admin/contact',
      icon: BuildingOfficeIcon,
      description: 'Cập nhật thông tin liên hệ và mạng xã hội'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Header */}
      <header className="glass-card backdrop-blur-md border-b border-white/10">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="glass-card p-6 hover:bg-white/5 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
