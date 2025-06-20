'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
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

import { Project } from '../data/projects';
import { Partner } from '../data/partners';
import { ContactData } from '../data/contact';
import { Service } from '../data/services';

interface FilterState {
  voice: string;
  category: string;
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<FilterState>({ voice: 'all', category: 'all' });
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  
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

  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, partnersResponse, servicesResponse, contactResponse] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/partners'),
          fetch('/api/services'),
          fetch('/api/contact')
        ]);

        const projectsData = await projectsResponse.json();
        const partnersData = await partnersResponse.json();
        const servicesData = await servicesResponse.json();
        const contactData = await contactResponse.json();

        setProjects(projectsData.projects);
        setPartners(partnersData.partners);
        setServices(servicesData.services);
        setContactData(contactData.contact);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Filter projects based on current filters and selected partner
  const filteredProjects = projects.filter(project => {
    const voiceMatch = filters.voice === 'all' || project.voice === filters.voice;
    const categoryMatch = filters.category === 'all' || project.category === filters.category;
    const partnerMatch = !selectedPartner || project.partner === selectedPartner;
    return voiceMatch && categoryMatch && partnerMatch;
  });

  // Helper functions để đếm số lượng dự án
  const getVoiceCount = (voice: string) => {
    return projects.filter(p => voice === 'all' ? true : p.voice === voice).length;
  };

  const getCategoryCount = (category: string) => {
    return projects.filter(p => {
      const normalizedCategory = category === 'Tất cả' ? 'all' : category;
      return normalizedCategory === 'all' ? true : p.category === category;
    }).length;
  };

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
            <a 
              href="#contact" 
              className="glass-card px-8 py-4 text-lg flex items-center justify-center gap-2 hover:text-green-300"
            >
              <EnvelopeIcon className="w-6 h-6" />
              Liên Hệ Ngay
            </a>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Cung cấp đa dạng các dịch vụ thu âm, lồng tiếng chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center mb-4 group-hover:from-blue-800/40 group-hover:to-purple-800/40 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={32}
                      height={32}
                      className="relative z-10 brightness-150 opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] [filter:drop-shadow(0_0_8px_rgba(59,130,246,0.4))] group-hover:[filter:drop-shadow(0_0_12px_rgba(147,51,234,0.5))]"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/70 mb-4 line-clamp-2">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="rounded-full w-1.5 h-1.5 bg-blue-500/50 mt-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="projects" className="scroll-section py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Dự Án Tiêu Biểu Của Chúng Tôi</h2>
          
          {/* Filters */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="flex items-center gap-4">
              <FunnelIcon className="w-5 h-5 text-white/70" />
              <select
                value={filters.voice}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, voice: e.target.value }));
                  setSelectedPartner(null);
                }}
                className="glass-card px-4 py-2 rounded-lg bg-transparent border border-white/10 text-white"
              >
                <option value="all" className="bg-gray-900">Tất cả giọng đọc ({getVoiceCount('all')})</option>
                <option value="north" className="bg-gray-900">Giọng Miền Bắc ({getVoiceCount('north')})</option>
                <option value="south" className="bg-gray-900">Giọng Miền Nam ({getVoiceCount('south')})</option>
              </select>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {selectedPartner && (
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="px-4 py-2 rounded-full text-sm glass-card text-blue-300 border border-blue-300/30 flex items-center gap-2"
                >
                  <span>Đối tác: {partners.find(p => p.description === selectedPartner)?.name || selectedPartner}</span>
                  <span className="text-xs">&times;</span>
                </button>
              )}
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setFilters(prev => ({ 
                      ...prev, 
                      category: category === 'Tất cả' ? 'all' : category 
                    }));
                    setSelectedPartner(null);
                  }}
                  className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                    (category === 'Tất cả' ? 'all' : category) === filters.category
                      ? 'glass-card text-blue-300 border border-blue-300/30'
                      : 'text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    (category === 'Tất cả' ? 'all' : category) === filters.category
                      ? 'bg-blue-500/20'
                      : 'bg-white/10'
                  }`}>
                    {getCategoryCount(category)}
                  </span>
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
                        {project.voice === 'north' ? 'Giọng miền Bắc' : 'Giọng miền Nam'}
                      </span>
                    </div>
                    <p className="text-white/70">{project.type}</p>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 text-sm">{project.year}</span>
                        <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <UserGroupIcon className="w-4 h-4 text-white/50" />
                        <span className="text-white/70">{project.partner}</span>
                      </div>
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
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Khách Hàng Của Chúng Tôi</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="w-full max-w-[200px] aspect-[3/2] glass-card p-4 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform group"
                >
                  <button
                    onClick={() => {
                      setSelectedPartner(partner.description);
                      const projectsSection = document.getElementById('projects');
                      if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full h-full flex flex-col items-center justify-center"
                  >
                    <div className="relative w-full h-16 mb-2">
                      {partner.logo ? (
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 rounded-lg" />
                      )}
                    </div>
                    <span className="text-lg font-semibold text-white/70 text-center group-hover:text-white transition-colors">
                      {partner.name}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-section py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Liên Hệ</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-semibold mb-6 text-white">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Tin nhắn</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all hover:border-white/20"
                    placeholder="Nội dung tin nhắn..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 group"
                >
                  <EnvelopeIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Gửi Tin Nhắn
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {contactData && (
                <>
                  {/* Social Links */}
                  <div className="glass-card p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-white">Kết nối với chúng tôi</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Facebook */}
                      <a
                        href={contactData.social.facebook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card p-4 flex items-center gap-3 hover:bg-blue-600/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                          <Image src={contactData.social.facebook.icon} alt="Facebook" width={24} height={24} className="opacity-70 group-hover:opacity-100" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Facebook</div>
                          <div className="text-sm text-white/60">{contactData.social.facebook.name}</div>
                        </div>
                      </a>

                      {/* Zalo */}
                      <a
                        href={contactData.social.zalo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card p-4 flex items-center gap-3 hover:bg-blue-500/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                          <Image src={contactData.social.zalo.icon} alt="Zalo" width={24} height={24} className="opacity-70 group-hover:opacity-100" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Zalo</div>
                          <div className="text-sm text-white/60">{contactData.social.zalo.name}</div>
                        </div>
                      </a>

                      {/* Phone */}
                      <a
                        href={contactData.social.phone.url}
                        className="glass-card p-4 flex items-center gap-3 hover:bg-green-500/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                          <Image src={contactData.social.phone.icon} alt="Phone" width={24} height={24} className="opacity-70 group-hover:opacity-100" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Điện thoại</div>
                          <div className="text-sm text-white/60">{contactData.social.phone.name}</div>
                        </div>
                      </a>

                      {/* Email */}
                      <a
                        href={contactData.social.email.url}
                        className="glass-card p-4 flex items-center gap-3 hover:bg-purple-500/10 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                          <Image src={contactData.social.email.icon} alt="Email" width={24} height={24} className="opacity-70 group-hover:opacity-100" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Email</div>
                          <div className="text-sm text-white/60 truncate">{contactData.social.email.name}</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Office Location */}
                  <div className="glass-card p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-white">Văn phòng</h3>
                    <div className="space-y-4">
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                          <Image src={contactData.office.address.icon} alt="Location" width={24} height={24} className="opacity-70" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{contactData.office.address.title}</div>
                          <div className="text-white/60 mt-1 whitespace-pre-line">
                            {contactData.office.address.content}
                          </div>
                        </div>
                      </div>
                      
                      {/* Working Hours */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                          <Image src={contactData.office.workingHours.icon} alt="Working Hours" width={24} height={24} className="opacity-70" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{contactData.office.workingHours.title}</div>
                          <div className="text-white/60 mt-1 whitespace-pre-line">
                            {contactData.office.workingHours.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
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
