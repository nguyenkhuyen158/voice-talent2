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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Project Management Dashboard</h1>
          <button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Project
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects">
            {(provided) => (
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
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border-b last:border-b-0 p-4 ${
                          snapshot.isDragging ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-move text-gray-400 hover:text-gray-600"
                            >
                              <ArrowsUpDownIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <p className="text-sm text-gray-500">
                                {project.type} | {project.year} | {project.partner}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProject(project);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="text-red-500 hover:text-red-700"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="glass-card max-w-2xl w-full p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      name="title"
                      defaultValue={editingProject?.title}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <input
                      name="type"
                      defaultValue={editingProject?.type}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <input
                      name="year"
                      defaultValue={editingProject?.year}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Voice</label>
                    <select
                      name="voice"
                      defaultValue={editingProject?.voice}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <option value="north">Miền Bắc</option>
                      <option value="south">Miền Nam</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <input
                      name="category"
                      defaultValue={editingProject?.category}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Partner</label>
                    <input
                      name="partner"
                      defaultValue={editingProject?.partner}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Video URL (Google Drive)</label>
                    <input
                      name="url"
                      defaultValue={editingProject?.url}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-white/70 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    {editingProject ? 'Update' : 'Create'} Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
