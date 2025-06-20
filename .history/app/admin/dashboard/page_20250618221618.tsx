'use client';
import Link from 'next/link';
import {
  DocumentDuplicateIcon,
  UsersIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const menuItems = [
    {      name: 'Quản lý dự án',
      href: '/admin/projects',
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
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">Tổng quan</h2>
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
    </div>
  );
}
