'use client';
import { useState, useEffect } from 'react';
import { Service } from '@/data/services';
import { PencilIcon, TrashIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { DropResult } from 'react-beautiful-dnd';

const reorder = (list: Service[], startIndex: number, endIndex: number): Service[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get features from comma-separated string
    const featuresString = formData.get('features') as string;
    const features = featuresString.split(',').map(feature => feature.trim());

    const serviceData = {
      id: editingService?.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string,
      features: features,
    };

    try {
      const response = await fetch('/api/services', {
        method: editingService ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: serviceData,
          id: editingService?.id
        }),
      });

      if (response.ok) {
        await fetchServices();
        setIsModalOpen(false);
        setEditingService(null);
      } else {
        console.error('Failed to save service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) return;

    try {
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchServices();
      } else {
        console.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newServices = Array.from(services);
    const [removed] = newServices.splice(result.source.index, 1);
    newServices.splice(result.destination.index, 0, removed);

    setServices(newServices);

    try {
      const response = await fetch('/api/services/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: newServices }),
      });

      if (!response.ok) {
        console.error('Failed to save new order');
        await fetchServices();
      }
    } catch (error) {
      console.error('Error saving new order:', error);
      await fetchServices();
    }
  };

  const ServiceList = dynamic(() => import('../ServiceListClient'), { ssr: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Quản lý dịch vụ</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingService(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Thêm dịch vụ mới
          </button>
        </div>
      </div>
      <ServiceList
        services={services}
        setEditingService={setEditingService}
        setIsModalOpen={setIsModalOpen}
        handleDelete={handleDelete}
        onDragEnd={onDragEnd}
      />
      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Tên dịch vụ</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingService?.title}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Mô tả</label>
                <textarea
                  name="description"
                  defaultValue={editingService?.description}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Icon URL</label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingService?.icon}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  placeholder="/icons/service-icon.svg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Tính năng (phân cách bằng dấu phẩy)
                </label>
                <textarea
                  name="features"
                  defaultValue={editingService?.features.join(', ')}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  placeholder="Tính năng 1, Tính năng 2, Tính năng 3"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingService(null);
                  }}
                  className="px-5 py-2.5 text-white/70 hover:text-white bg-transparent rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  {editingService ? 'Lưu thay đổi' : 'Thêm dịch vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
