'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Đăng nhập thành công');
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="w-full max-w-md">
        <div className="glass-card backdrop-blur-lg p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">Đăng nhập</h2>
            <p className="text-white/60 mt-2">Đăng nhập để quản lý nội dung website</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                placeholder="Nhập mật khẩu"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 py-3 px-6 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 group"
            >
              <KeyIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
