'use client';
import { useState, useEffect } from 'react';
import { Partner } from '@/data/partners';
import { PencilIcon, TrashIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Image from 'next/image';

interface LogoSuggestion {
  name: string;
  path: string;
}

export default function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoSuggestions, setLogoSuggestions] = useState<LogoSuggestion[]>([]);
  const [showLogoSuggestions, setShowLogoSuggestions] = useState(false);

  useEffect(() => {
    fetchPartners();
    fetchLogoSuggestions();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners');
      const data = await response.json();
      setPartners(data.partners);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    }
  };

  const fetchLogoSuggestions = async () => {
    try {
      const response = await fetch('/api/logos');
      const data = await response.json();
      setLogoSuggestions(data.logos);
    } catch (error) {
      console.error('Failed to fetch logo suggestions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const partnerData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      logo: formData.get('logo') as string,
    };

    try {
      const response = await fetch('/api/partners', {
        method: editingPartner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner: partnerData,
          id: editingPartner?.id
        }),
      });

      if (response.ok) {
        await fetchPartners();
        setIsModalOpen(false);
        setEditingPartner(null);
      } else {
        console.error('Failed to save partner');
      }
    } catch (error) {
      console.error('Error saving partner:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đối tác này?')) return;

    try {
      const response = await fetch('/api/partners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchPartners();
      } else {
        console.error('Failed to delete partner');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(partners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPartners(items);

    try {
      const response = await fetch('/api/partners/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partners: items }),
      });

      if (!response.ok) {
        console.error('Failed to save new order');
        fetchPartners();
      }
    } catch (error) {
      console.error('Error saving new order:', error);
      fetchPartners();
    }
  };

  const handleLogoSelect = (logoPath: string) => {
    const form = document.querySelector('form');
    if (form) {
      const logoInput = form.querySelector('input[name="logo"]') as HTMLInputElement;
      if (logoInput) {
        logoInput.value = logoPath;
        setShowLogoSuggestions(false);
      }
    }
  };

  const categories = [
    'Truyền thông',
    'Công nghệ',
    'Đa ngành',
    'Thương mại điện tử',
    'Game',
    'Giải trí'
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Quản lý đối tác</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingPartner(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Thêm đối tác mới
          </button>
        </div>
      </div>      <div className="space-y-8">
        <section>
          <div className="grid gap-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="partners" type="PARTNER_LIST">
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {partners.map((partner, index) => (
                      <Draggable 
                        key={partner.id} 
                        draggableId={partner.id} 
                        index={index}
                        isDragDisabled={false}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`glass-card p-4 space-y-4 ${
                              snapshot.isDragging ? 'bg-blue-900/50' : ''
                            }`}
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
                                  {partner.logo && (
                                    <Image
                                      src={partner.logo}
                                      alt={partner.name}
                                      fill
                                      className="object-contain p-1"
                                    />
                                  )}
                                </div>
                                <div>
                                  <h4 className="text-lg font-medium text-white">{partner.name}</h4>
                                  <p className="text-sm text-white/70 mt-1">{partner.description}</p>
                                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                                    {partner.category}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setEditingPartner(partner);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                  title="Chỉnh sửa"
                                >
                                  <PencilIcon className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(partner.id)}
                                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                  title="Xóa"
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
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
          </div>
        </section>
      </div>      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingPartner ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Tên đối tác
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingPartner?.name}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Logo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="logo"
                    defaultValue={editingPartner?.logo}
                    onFocus={() => setShowLogoSuggestions(true)}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {showLogoSuggestions && logoSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-50 p-3">
                      <div className="max-h-60 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {logoSuggestions.map((logo) => (
                          <button
                            key={logo.path}
                            type="button"
                            onClick={() => handleLogoSelect(logo.path)}
                            className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors relative aspect-square group"
                          >
                            <Image
                              src={logo.path}
                              alt={logo.name}
                              fill
                              className="object-contain p-1"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-xs text-white text-center px-1">
                                {logo.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowLogoSuggestions(false)}
                        className="w-full mt-2 px-3 py-1 text-sm text-white/60 hover:text-white"
                      >
                        Đóng gợi ý
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingPartner?.description}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Lĩnh vực
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingPartner?.category}
                  list="categories"
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPartner(null);
                  }}
                  className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {editingPartner ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rest of the component */}
    </div>
  );
}
