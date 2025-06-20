'use client';
import { PencilIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { Service } from '@/data/services';
import type { DropResult } from 'react-beautiful-dnd';
import React from 'react';

type ServiceListClientProps = {
  services: Service[];
  setEditingService: (service: Service) => void;
  setIsModalOpen: (open: boolean) => void;
  handleDelete: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
};

const ServiceListClient: React.FC<ServiceListClientProps> = ({
  services,
  setEditingService,
  setIsModalOpen,
  handleDelete,
  onDragEnd,
}) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="droppable-list">
      {(provided) => (
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
              {(provided, snapshot) => (
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

export default ServiceListClient; 