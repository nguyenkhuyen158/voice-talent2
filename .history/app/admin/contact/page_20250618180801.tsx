'use client';
import { useState, useEffect } from 'react';
import { Contact, ContactData, SocialLink, OfficeInfo } from '@/data/contact';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ContactManagement() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ContactData | null>(null);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact');
      const data: Contact = await response.json();
      setContactData(data.contact);
      setEditedData(data.contact);
    } catch (error) {
      console.error('Failed to fetch contact data:', error);
    }
  };

  const handleSave = async () => {
    if (!editedData) return;

    try {
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact: editedData }),
      });

      if (response.ok) {
        setContactData(editedData);
        setIsEditing(false);
      } else {
        console.error('Failed to save contact data');
      }
    } catch (error) {
      console.error('Error saving contact data:', error);
    }
  };

  const handleSocialChange = (key: keyof ContactData['social'], field: keyof SocialLink, value: string) => {
    if (!editedData) return;

    setEditedData({
      ...editedData,
      social: {
        ...editedData.social,
        [key]: {
          ...editedData.social[key],
          [field]: value
        }
      }
    });
  };

  const handleOfficeChange = (key: keyof ContactData['office'], field: keyof OfficeInfo, value: string) => {
    if (!editedData) return;

    setEditedData({
      ...editedData,
      office: {
        ...editedData.office,
        [key]: {
          ...editedData.office[key],
          [field]: value
        }
      }
    });
  };

  if (!contactData || !editedData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Quản lý thông tin liên hệ</h1>
          {isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
              >
                <CheckIcon className="w-5 h-5" />
                Lưu thay đổi
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(contactData);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                <XMarkIcon className="w-5 h-5" />
                Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <PencilIcon className="w-5 h-5" />
              Chỉnh sửa
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Social Links */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6">Mạng xã hội</h2>
            <div className="space-y-6">
              {Object.entries(editedData.social).map(([key, social]) => (
                <div key={key} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Image src={social.icon} alt={key} width={24} height={24} className="opacity-70" />
                    </div>
                    <div className="font-medium capitalize">{key}</div>
                  </div>
                  <div className="grid gap-4 pl-13">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Tên hiển thị</label>
                      <input
                        type="text"
                        value={social.name}
                        onChange={(e) => handleSocialChange(key as keyof ContactData['social'], 'name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">URL</label>
                      <input
                        type="text"
                        value={social.url}
                        onChange={(e) => handleSocialChange(key as keyof ContactData['social'], 'url', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Office Info */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6">Thông tin văn phòng</h2>
            <div className="space-y-6">
              {Object.entries(editedData.office).map(([key, info]) => (
                <div key={key} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Image src={info.icon} alt={key} width={24} height={24} className="opacity-70" />
                    </div>
                    <div className="font-medium capitalize">{key}</div>
                  </div>
                  <div className="grid gap-4 pl-13">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Tiêu đề</label>
                      <input
                        type="text"
                        value={info.title}
                        onChange={(e) => handleOfficeChange(key as keyof ContactData['office'], 'title', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">Nội dung</label>
                      <textarea
                        value={info.content}
                        onChange={(e) => handleOfficeChange(key as keyof ContactData['office'], 'content', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
