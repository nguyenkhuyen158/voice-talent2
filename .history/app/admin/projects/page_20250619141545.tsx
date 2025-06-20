'use client';
import { useState, useEffect } from 'react';
import { Project } from '@/data/projects';
import { PencilIcon, TrashIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  // Create/Update project
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectData = {
      title: formData.get('title') as string,
      type: formData.get('type') as string,
      year: formData.get('year') as string,
      url: formData.get('url') as string,
      voice: formData.get('voice') as 'north' | 'south',
      category: formData.get('category') as string,
      partner: formData.get('partner') as string,
    };

    try {
      const response = await fetch('/api/projects', {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: projectData,
          id: editingProject ? projects.findIndex(p => p.title === editingProject.title) : undefined
        }),
      });

      if (response.ok) {
        await fetchProjects();
        setIsModalOpen(false);
        setEditingProject(null);
      } else {
        console.error('Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  // Delete project
  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: index }),
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setProjects(items);

    // Lưu thứ tự mới vào server
    try {
      const response = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: items }),
      });

      if (!response.ok) {
        console.error('Failed to save new order');
        // Revert changes if save failed
        fetchProjects();
      }
    } catch (error) {
      console.error('Error saving new order:', error);
      // Revert changes if save failed
      fetchProjects();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Quản lý dự án</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
        >
          <PlusIcon className="w-5 h-5" />
          Thêm dự án
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects" type="PROJECT_LIST">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="glass-card overflow-hidden"
            >
              {projects.map((project, index) => (
                <Draggable
                  key={project.title}
                  draggableId={project.title}
                  index={index}
                  isDragDisabled={false}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border-b border-white/10 last:border-b-0 p-6 transition-all ${snapshot.isDragging ? 'bg-blue-900/50' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-6 flex-1">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move text-white/50 hover:text-white/80 transition-colors"
                          >
                            <ArrowsUpDownIcon className="w-6 h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-lg text-white truncate">{project.title}</h3>
                            <p className="text-sm text-white/70 mt-1">
                              {project.type} • {project.year} • Đối tác: {project.partner}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                project.voice === 'north'
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'bg-green-500/20 text-green-300'
                              }`}>
                                {project.voice === 'north' ? 'Giọng Bắc' : 'Giọng Nam'}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                                {project.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setIsModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                            title="Chỉnh sửa"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-500"
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
      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="glass-card max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProject ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Tên dự án</label>
                  <input
                    name="title"
                    defaultValue={editingProject?.title}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Loại dự án</label>
                  <input
                    name="type"
                    defaultValue={editingProject?.type}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Năm</label>
                  <input
                    name="year"
                    defaultValue={editingProject?.year}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Giọng</label>
                  <select
                    name="voice"
                    defaultValue={editingProject?.voice}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  >
                    <option value="north">Miền Bắc</option>
                    <option value="south">Miền Nam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Thể loại</label>
                  <input
                    name="category"
                    defaultValue={editingProject?.category}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Đối tác</label>
                  <input
                    name="partner"
                    defaultValue={editingProject?.partner}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-white/90 mb-2">Video URL (Google Drive)</label>
                  <input
                    name="url"
                    defaultValue={editingProject?.url}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-white/70 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
                >
                  {editingProject ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
