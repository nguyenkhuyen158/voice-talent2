'use client';
import { motion } from 'framer-motion';
import { 
  MicrophoneIcon, 
  PlayCircleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  AcademicCapIcon,
  EnvelopeIcon 
} from '@heroicons/react/24/outline';
import ReactPlayer from 'react-player';

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-800">VoicePro</span>
            <div className="hidden md:flex space-x-8">
              {['About', 'Services', 'Portfolio', 'Testimonials', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="pt-32 pb-20 px-6 text-center relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img
              src="/profile-placeholder.jpg"
              alt="Your Name"
              className="w-40 h-40 rounded-full mx-auto shadow-xl object-cover"
            />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Give Voice to Your Vision
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional voice talent bringing your stories, brands, and characters to life with passion and precision
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2">
              <PlayCircleIcon className="w-5 h-5" />
              Listen to Demo
            </button>
            <button className="px-8 py-3 border-2 border-gray-300 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5" />
              Contact Me
            </button>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        variants={fadeIn}
        viewport={{ once: true }}
        className="py-20 bg-gray-50"
        id="services"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Voice Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MicrophoneIcon className="w-8 h-8" />,
                title: "Commercial Voiceover",
                desc: "Engaging commercial narration for TV, radio, and digital media"
              },
              {
                icon: <DocumentTextIcon className="w-8 h-8" />,
                title: "E-Learning & Corporate",
                desc: "Clear and professional narration for educational and training content"
              },
              {
                icon: <AcademicCapIcon className="w-8 h-8" />,
                title: "Character Voices",
                desc: "Versatile character voices for animation and gaming"
              }
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Recent Work</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-100">
                  {/* Add your audio player or video demo here */}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Project Title {item}</h3>
                  <p className="text-gray-600">Brief description of the project and your role in it.</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Client Testimonials</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "An absolute professional who delivered exactly what we needed. The quality and timing were perfect!",
                name: "John Smith",
                role: "Creative Director"
              },
              {
                text: "Incredible range and versatility. Brought our characters to life in ways we couldn't have imagined.",
                name: "Sarah Johnson",
                role: "Game Developer"
              },
              {
                text: "Fast, professional, and extremely talented. Will definitely work with again!",
                name: "Michael Brown",
                role: "Marketing Manager"
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-sm"
              >
                <p className="text-gray-600 italic mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Get in Touch</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2025 Your Voice Talent Name. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
