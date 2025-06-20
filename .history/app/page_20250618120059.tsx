'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MicrophoneIcon, 
  PlayCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  SpeakerWaveIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

import { Project, projects as projectsData } from '@/data/projects';

interface FilterState {
  voice: string;
  category: string;
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<FilterState>({ voice: 'all', category: 'all' });
  
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

  const partners = [
    "VTV", "HTV", "Samsung", "VinGroup", "FPT", "Shopee", 
    "Mobile Legends", "Garena", "Netflix Vietnam"
  ];

  const projects = projectsData;

  // Filter projects based on current filters
  const filteredProjects = projects.filter(project => {
    const voiceMatch = filters.voice === 'all' || project.voice === filters.voice;
    const categoryMatch = filters.category === 'all' || project.category === filters.category;
    return voiceMatch && categoryMatch;
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-section').forEach(
      section => observer.observe(section)
    );

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-multiply z-0" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full nav-glass z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold gradient-text">Voice Pro</span>
            <div className="hidden md:flex space-x-8">
              {[
                { text: 'Giới thiệu', id: 'hero' },
                { text: 'Dịch vụ', id: 'services' },
                { text: 'Dự án', id: 'projects' },
                { text: 'Đối tác', id: 'partners' },
                { text: 'Liên hệ', id: 'contact' }
              ].map((item) => (
                <a
                  key={item.text}
                  href={`#${item.id}`}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="scroll-section min-h-screen flex items-center justify-center relative pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto px-6 text-center relative z-10"
        >
          <div className="mb-8 floating">
            <img
              src="/your-photo.jpg"
              alt="Voice Talent"
              className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-white/10 shadow-2xl"
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
            Giọng nói của bạn
            <br />
            Thương hiệu của tôi
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
            Mang đến giọng nói chuyên nghiệp cho dự án của bạn với hơn 10 năm kinh nghiệm trong lĩnh vực lồng tiếng
          </p>
          
          {/* Sound wave animation */}
          <div className="flex justify-center mb-12">
            <div className="sound-wave">
              {[...Array(8)].map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="glass-card px-8 py-4 text-lg flex items-center justify-center gap-2 hover:text-blue-300">
              <PlayCircleIcon className="w-6 h-6" />
              Nghe Demo
            </button>
            <button className="glass-card px-8 py-4 text-lg flex items-center justify-center gap-2 hover:text-green-300">
              <EnvelopeIcon className="w-6 h-6" />
              Liên Hệ Ngay
            </button>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="scroll-section py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Dịch Vụ</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <MicrophoneIcon className="w-8 h-8" />,
                  title: "Quảng Cáo TVC",
                  desc: "Giọng đọc quảng cáo sinh động cho TV, radio và digital media"
                },
                {
                  icon: <DocumentTextIcon className="w-8 h-8" />,
                  title: "Đào Tạo & Doanh Nghiệp",
                  desc: "Lồng tiếng cho video đào tạo và tài liệu doanh nghiệp"
                },
                {
                  icon: <AcademicCapIcon className="w-8 h-8" />,
                  title: "Nhân Vật Hoạt Hình",
                  desc: "Lồng tiếng nhân vật cho phim hoạt hình và game"
                }
              ].map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="glass-card p-8"
                >
                  <div className="text-blue-400 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-white/70">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="projects" className="scroll-section py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Dự Án Tiêu Biểu</h2>
          
          {/* Filters */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="flex items-center gap-4">
              <FunnelIcon className="w-5 h-5 text-white/70" />
              <select
                value={filters.voice}
                onChange={(e) => setFilters(prev => ({ ...prev, voice: e.target.value }))}
                className="glass-card px-4 py-2 rounded-lg bg-transparent border border-white/10 text-white"
              >
                <option value="all" className="bg-gray-900">Tất cả giọng đọc</option>
                <option value="north" className="bg-gray-900">Giọng Miền Bắc</option>
                <option value="south" className="bg-gray-900">Giọng Miền Nam</option>
              </select>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    category: category === 'Tất cả' ? 'all' : category 
                  }))}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    (category === 'Tất cả' ? 'all' : category) === filters.category
                      ? 'glass-card text-blue-300 border border-blue-300/30'
                      : 'text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filteredProjects.map((project, idx) => {
              const fileId = project.url.match(/\/d\/(.*?)\/view/)?.[1];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                    <iframe
                      src={`https://drive.google.com/file/d/${fileId}/preview`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                      style={{ background: 'transparent' }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{project.title}</h3>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        project.voice === 'north' 
                          ? 'bg-blue-500/20 text-blue-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {project.voice === 'north' ? 'Giọng Bắc' : 'Giọng Nam'}
                      </span>
                    </div>
                    <p className="text-white/70">{project.type}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white/50 text-sm">{project.year}</span>
                      <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/70 text-lg">
                Không tìm thấy dự án nào phù hợp với bộ lọc đã chọn
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="scroll-section py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Đối Tác</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  className="w-full max-w-[200px] aspect-[3/2] glass-card p-4 flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <span className="text-xl font-bold text-white/70 text-center">
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-section py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Liên Hệ</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Họ và tên</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Tin nhắn</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full glass-card py-3 text-white hover:text-blue-300 transition-colors"
              >
                Gửi Tin Nhắn
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 glass-card mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/60">© 2025 Voice Talent. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-white/60 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">YouTube</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
