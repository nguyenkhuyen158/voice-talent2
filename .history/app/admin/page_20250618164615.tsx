'use client';
import { useState, useEffect } from 'react';
import { Project } from '@/data/projects';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

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

        {/* Projects Table */}
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Year</th>
                <th className="px-6 py-3 text-left">Voice</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Partner</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4">{project.title}</td>
                  <td className="px-6 py-4">{project.type}</td>
                  <td className="px-6 py-4">{project.year}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      project.voice === 'north'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {project.voice === 'north' ? 'Bắc' : 'Nam'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{project.category}</td>
                  <td className="px-6 py-4">{project.partner}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <PencilIcon className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
