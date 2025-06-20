'use client';
import { useState, useEffect } from 'react';
import { Service } from '@/data/services';
import { PencilIcon, TrashIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    // Reorder the services array
    const reorderedServices = reorder(
      services,
      result.source.index,
      result.destination.index
    );

    // Update the state
    setServices(reorderedServices);

    // Save the new order to the server
    try {
      const response = await fetch('/api/services/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: reorderedServices }),
      });

      if (!response.ok) {
        console.error('Failed to save new order');
        await fetchServices(); // Revert to original order if save failed
      }
    } catch (error) {
      console.error('Error saving new order:', error);
      await fetchServices(); // Revert to original order if save failed
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Quản lý dịch vụ</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingService(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Thêm dịch vụ mới
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => (
            <div
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              className="space-y-4"
            >
              {services.map((service, index) => (
                <Draggable
                  key={service.id}
                  draggableId={service.id}
                  index={index}
                >
                  {(draggableProvided, snapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      className={`glass-card p-4 ${
                        snapshot.isDragging ? 'bg-blue-900/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          {...draggableProvided.dragHandleProps}
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
                              className="p-2 text-yellow-500 hover:text-yellow-400"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-2 text-red-500 hover:text-red-400"
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
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="fixed inset-0 bg-black/70" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-gray-900 border border-white/10 max-w-2xl w-full p-6 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white">
              {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Tên dịch vụ</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingService?.title}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Mô tả</label>
                <textarea
                  name="description"
                  defaultValue={editingService?.description}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Icon URL</label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingService?.icon}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="/icons/service-icon.svg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tính năng (phân cách bằng dấu phẩy)
                </label>
                <textarea
                  name="features"
                  defaultValue={editingService?.features.join(', ')}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
                  className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
