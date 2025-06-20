'use client';
import { useState, useEffect } from 'react';
import { Service } from '@/data/services';
import { PencilIcon, TrashIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

const reorder = (list: Service[], startIndex: number, endIndex: number): Service[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ServiceList = ({ services, onDragEnd }: { services: Service[], onDragEnd: (result: DropResult) => void }) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable-list">
      {(provided: DroppableProvided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="space-y-4"
        >
          {services.map((service, index) => (
            <Draggable
              key={service.id}
              draggableId={service.id}
              index={index}
            >
              {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={`glass-card p-6 transition-all ${snapshot.isDragging ? 'bg-blue-900/50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      {...provided.dragHandleProps}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-move"
                    >
                      <ArrowsUpDownIcon className="w-6 h-6 opacity-70" />
                    </div>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 relative bg-white/10 rounded-lg overflow-hidden">
                        {service.icon && (
                          <Image
                            src={service.icon}
                            alt={service.title}
                            fill
                            className="object-contain p-1"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {service.title}
                        </h3>
                        <p className="text-sm text-white/60">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setIsModalOpen(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
                          title="Xóa"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }
      const data = await response.json();
      setServices(data.services);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại.');
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
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save service: ${response.statusText}`);
      }

      await fetchServices();
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err) {
      console.error('Error saving service:', err);
      setError('Không thể lưu dịch vụ. Vui lòng thử lại.');
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

      if (!response.ok) {
        throw new Error(`Failed to delete service: ${response.statusText}`);
      }

      await fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Không thể xóa dịch vụ. Vui lòng thử lại.');
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
        throw new Error(`Failed to save new order: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error saving new order:', err);
      setError('Không thể lưu thứ tự mới. Vui lòng thử lại.');
      await fetchServices();
    }
  };

  return (
    <div className="p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
          {error}
        </div>
      )}
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
      <ServiceList services={services} onDragEnd={onDragEnd} />
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
