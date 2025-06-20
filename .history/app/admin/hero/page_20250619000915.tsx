'use client';
import { useState, useEffect } from 'react';
import { HeroData } from '@/data/hero';

export default function HeroManagement() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero');
      const data = await response.json();
      setHeroData(data.hero);
    } catch (error) {
      console.error('Failed to fetch hero data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedData = {
      hero: {
        photo: formData.get('photo'),
        title: {
          line1: formData.get('titleLine1'),
          line2: formData.get('titleLine2')
        },
        description: formData.get('description'),
        buttons: {
          demo: {
            text: formData.get('demoButtonText'),
            icon: formData.get('demoButtonIcon')
          },
          contact: {
            text: formData.get('contactButtonText'),
            icon: formData.get('contactButtonIcon')
          }
        }
      }
    };

    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await fetchHeroData();
        setIsEditing(false);
      } else {
        console.error('Failed to update hero data');
      }
    } catch (error) {
      console.error('Error updating hero data:', error);
    }
  };

  if (!heroData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Quản lý Hero Section</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
        >
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Ảnh đại diện</label>
              <input
                type="text"
                name="photo"
                defaultValue={heroData.photo}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                placeholder="/your-photo.jpg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tiêu đề dòng 1</label>
                <input
                  type="text"
                  name="titleLine1"
                  defaultValue={heroData.title.line1}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tiêu đề dòng 2</label>
                <input
                  type="text"
                  name="titleLine2"
                  defaultValue={heroData.title.line2}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Mô tả</label>
              <textarea
                name="description"
                defaultValue={heroData.description}
                required
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium text-white">Nút Demo</h3>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Text</label>
                  <input
                    type="text"
                    name="demoButtonText"
                    defaultValue={heroData.buttons.demo.text}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Icon</label>
                  <input
                    type="text"
                    name="demoButtonIcon"
                    defaultValue={heroData.buttons.demo.icon}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-white">Nút Liên hệ</h3>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Text</label>
                  <input
                    type="text"
                    name="contactButtonText"
                    defaultValue={heroData.buttons.contact.text}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Icon</label>
                  <input
                    type="text"
                    name="contactButtonIcon"
                    defaultValue={heroData.buttons.contact.icon}
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="glass-card p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-white mb-2">Ảnh đại diện</h3>
              <p className="text-white/70">{heroData.photo}</p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Tiêu đề</h3>
              <p className="text-white/70">{heroData.title.line1}</p>
              <p className="text-white/70">{heroData.title.line2}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white mb-2">Mô tả</h3>
            <p className="text-white/70">{heroData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-white mb-2">Nút Demo</h3>
              <div className="text-white/70">
                <p>Text: {heroData.buttons.demo.text}</p>
                <p>Icon: {heroData.buttons.demo.icon}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Nút Liên hệ</h3>
              <div className="text-white/70">
                <p>Text: {heroData.buttons.contact.text}</p>
                <p>Icon: {heroData.buttons.contact.icon}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
