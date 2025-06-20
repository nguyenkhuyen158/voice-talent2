'use client';

import { FunnelIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { Project } from '../../data/projects';
import { useState, useEffect } from 'react';

export default function Projects({ selectedPartner, onChangeFilter }: { 
  selectedPartner: string | null;
  onChangeFilter: (voice: string) => void;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({ voice: 'all', category: 'all' });
  
  const categories = [
    'Tất cả',
    'Thực phẩm',
    'Hàng tiêu dùng',
    'Đồ điện tử',
    'Ngân hàng tài chính',
    'Game',
    'Giáo dục',
    'Y tế',
  ];

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects);
    }
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const voiceMatch = filters.voice === 'all' || project.voice === filters.voice;
    const categoryMatch = filters.category === 'all' || project.category === filters.category;
    const partnerMatch = !selectedPartner || project.partner === selectedPartner;
    return voiceMatch && categoryMatch && partnerMatch;
  });

  const getVoiceCount = (voice: string) => {
    return projects.filter(p => voice === 'all' ? true : p.voice === voice).length;
  };

  const getCategoryCount = (category: string) => {
    return projects.filter(p => {
      const normalizedCategory = category === 'Tất cả' ? 'all' : category;
      return normalizedCategory === 'all' ? true : p.category === category;
    }).length;
  };

  return (
    <section id="projects" className="scroll-section py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Dự Án Tiêu Biểu Của Chúng Tôi</h2>
        
        {/* Rest of the existing Projects section JSX */}
        {/* ...copy the filters and projects grid from the original file... */}
      </div>
    </section>
  );
}
