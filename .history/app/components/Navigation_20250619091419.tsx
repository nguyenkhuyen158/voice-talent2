import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {
  const links = [
    { text: 'Giới thiệu', id: 'hero' },
    { text: 'Dịch vụ', id: 'services' },
    { text: 'Dự án', id: 'projects' },
    { text: 'Đối tác', id: 'partners' },
    { text: 'Liên hệ', id: 'contact' }
  ];

  return (
    <nav className="fixed top-0 w-full nav-glass z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold gradient-text">Voice Pro</span>
          <div className="hidden md:flex space-x-8">
            {links.map((link) => (
              <a
                key={link.text}
                href={`#${link.id}`}
                className="text-white/80 hover:text-white transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
