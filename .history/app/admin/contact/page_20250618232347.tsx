'use client';
import { useState, useEffect } from 'react';
import { Contact, ContactData, SocialLink, OfficeInfo } from '@/data/contact';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

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
      toast.error('Lỗi khi tải dữ liệu liên hệ');
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Quản lý thông tin liên hệ</h2>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
            >
              <PencilIcon className="w-4 h-4" />
              Chỉnh sửa
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm"
              >
                <CheckIcon className="w-4 h-4" />
                Lưu
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedData(contactData);
                }}
                className="px-4 py-2 flex items-center gap-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm"
              >
                <XMarkIcon className="w-4 h-4" />
                Hủy
              </button>
            </>
          )}
        </div>
      </div>

      {contactData && (
        <div className="space-y-8">
          {/* Social Links Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-white/90">Mạng xã hội</h3>
            <div className="grid gap-4">
              {Object.entries(contactData.social).map(([platform, data]) => (
                <div key={platform} className="glass-card p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Image src={data.icon} alt={platform} width={24} height={24} className="opacity-70" />
                    </div>
                    <h4 className="text-lg font-medium capitalize text-white">{platform}</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Tên hiển thị</label>
                      <input
                        type="text"
                        value={editedData?.social[platform].name || ''}
                        onChange={(e) => handleSocialChange(platform, 'name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Đường dẫn</label>
                      <input
                        type="text"
                        value={editedData?.social[platform].url || ''}
                        onChange={(e) => handleSocialChange(platform, 'url', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Office Info Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-white/90">Thông tin văn phòng</h3>
            <div className="grid gap-4">
              {Object.entries(contactData.office).map(([type, data]) => (
                <div key={type} className="glass-card p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Image src={data.icon} alt={type} width={24} height={24} className="opacity-70" />
                    </div>
                    <h4 className="text-lg font-medium capitalize text-white">
                      {type === 'address' ? 'Địa chỉ' : 'Giờ làm việc'}
                    </h4>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Tiêu đề</label>
                      <input
                        type="text"
                        value={editedData?.office[type].title || ''}
                        onChange={(e) => handleOfficeChange(type, 'title', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-1">Nội dung</label>
                      <textarea
                        value={editedData?.office[type].content || ''}
                        onChange={(e) => handleOfficeChange(type, 'content', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
