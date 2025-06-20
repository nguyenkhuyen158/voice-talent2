'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DocumentDuplicateIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  EyeIcon,
  BriefcaseIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import type { Project } from '@/data/projects';
import type { Partner } from '@/data/partners';

interface AnalyticsData {
  totalVisits: number;
  totalUniqueIPs: number;
  totalUniqueSessions: number;
  dailyStats: {
    date: string;
    visits: number;
    uniqueVisits: number;
    uniqueIPVisits: number;
    uniqueSessionVisits: number;
  }[];
  today: {
    visits: number;
    uniqueVisits: number;
    uniqueIPVisits: number;
    uniqueSessionVisits: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    partners: 0,
    totalVisits: 0,
    uniqueVisitors: 0,
    todayUniqueIPs: 0,
    todayUniqueSessions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, partnersRes, analyticsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/partners'),
          fetch('/api/analytics')
        ]);

        const projectsData = await projectsRes.json() as { projects: Project[] };
        const partnersData = await partnersRes.json() as { partners: Partner[] };
        const analyticsData = await analyticsRes.json() as AnalyticsData;

        setStats({
          projects: projectsData.projects.length,
          partners: partnersData.partners.length,
          totalVisits: analyticsData.totalVisits,
          uniqueVisitors: analyticsData.totalUniqueIPs,
          todayUniqueIPs: analyticsData.today.uniqueIPVisits,
          todayUniqueSessions: analyticsData.today.uniqueSessionVisits,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      name: 'Tổng số dự án',
      value: stats.projects,
      icon: BriefcaseIcon,
      href: '/admin/projects',
      color: 'from-blue-500/20 to-blue-600/20',
      textColor: 'text-blue-400',
    },
    {
      name: 'Đối tác',
      value: stats.partners,
      icon: UsersIcon,
      href: '/admin/partners',
      color: 'from-purple-500/20 to-purple-600/20',
      textColor: 'text-purple-400',
    },
    {
      name: 'Tổng lượt truy cập',
      value: stats.totalVisits,
      icon: EyeIcon,
      href: '#',
      color: 'from-green-500/20 to-green-600/20',
      textColor: 'text-green-400',
    },
    {
      name: 'Số IP duy nhất',
      value: stats.uniqueVisitors,
      icon: ChartBarIcon,
      href: '#',
      color: 'from-amber-500/20 to-amber-600/20',
      textColor: 'text-amber-400',
      description: 'Tổng số IP khác nhau đã truy cập',
    },
    {
      name: 'Truy cập hôm nay (IP)',
      value: stats.todayUniqueIPs,
      icon: ChartBarIcon,
      href: '#',
      color: 'from-rose-500/20 to-rose-600/20',
      textColor: 'text-rose-400',
      description: 'Số lượng IP duy nhất truy cập hôm nay',
    },
    {
      name: 'Session hôm nay',
      value: stats.todayUniqueSessions,
      icon: ChartBarIcon,
      href: '#',
      color: 'from-indigo-500/20 to-indigo-600/20',
      textColor: 'text-indigo-400',
      description: 'Số phiên truy cập duy nhất hôm nay',
    },
  ];

  const menuItems = [
    {
      name: 'Quản lý dự án',
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
      name: 'Quản lý media',
      href: '/admin/media',
      icon: PhotoIcon,
      description: 'Quản lý hình ảnh, logo và tài nguyên media'
    },
    {
      name: 'Quản lý liên hệ',
      href: '/admin/contact',
      icon: BuildingOfficeIcon,
      description: 'Cập nhật thông tin liên hệ và mạng xã hội'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Thống kê</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-16 bg-white/10 rounded-lg"></div>
              </div>
            ))
          ) : (
            statCards.map((stat) => (
              <Link
                key={stat.name}
                href={stat.href}
                className="glass-card p-6 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{stat.name}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {stat.value.toLocaleString()}
                    </h3>
                    {stat.description && (
                      <p className="text-xs text-white/40 mt-1">
                        {stat.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Quản lý</h2>
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
    </div>
  );
}
