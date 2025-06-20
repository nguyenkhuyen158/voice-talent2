'use client';

import { FunnelIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Project } from '../../data/tmp/projects';
import { useState } from 'react';

interface ProjectsProps {
  projects: Project[];
  selectedPartner: string | null;
  onChangeFilter: (voice: string) => void;
}

export default function Projects({ projects, selectedPartner, onChangeFilter }: ProjectsProps) {
  const [filters, setFilters] = useState({ voice: 'all', category: 'all' });
  
  const categories = [
    'Tất cả',
    'Thực phẩm',
    'Hàng tiêu dùng',
    'Đồ điện tử',
    'Ngân hàng tài chính',
    'Giáo dục',
    'Y tế',
    'Du lịch',
    'Bất động sản'
  ];

  const voices = [
    { id: 'all', name: 'Tất cả' },
    { id: 'north', name: 'Giọng Bắc' },
    { id: 'south', name: 'Giọng Nam' },
    { id: 'middle', name: 'Giọng Trung' }
  ];

  const filteredProjects = projects.filter(project => {
    if (selectedPartner && project.partner !== selectedPartner) return false;
    if (filters.voice !== 'all' && project.voice !== filters.voice) return false;
    if (filters.category !== 'all' && project.category !== filters.category) return false;
    return true;
  });

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Dự Án Tiêu Biểu</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Khám phá những dự án nổi bật mà chúng tôi đã thực hiện
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center items-center">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-white/60" />
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category === 'Tất cả' ? 'all' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-white/60" />
            <select
              value={filters.voice}
              onChange={(e) => {
                const value = e.target.value;
                setFilters(prev => ({ ...prev, voice: value }));
                onChangeFilter(value);
              }}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {voices.map(voice => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-white/60">{project.partner}</p>
              </div>
              <div className="space-y-2 text-sm text-white/60">
                <p>Loại: {project.type}</p>
                <p>Năm: {project.year}</p>
                <p>Giọng đọc: {voices.find(v => v.id === project.voice)?.name}</p>
                <p>Lĩnh vực: {project.category}</p>
              </div>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-purple-400 hover:text-purple-300"
                >
                  Nghe Demo →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
