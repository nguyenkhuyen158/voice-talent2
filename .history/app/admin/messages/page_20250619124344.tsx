'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { ContactMessage } from '../../../data/contact-messages';
import Image from 'next/image';

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/contact-messages');
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        } else {
          toast.error(data.error || 'Failed to load messages');
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Có lỗi khi tải danh sách tin nhắn');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Mark message as read  const handleMarkAsRead = async (message: ContactMessage) => {
    try {
      console.log('Marking message as read:', message.id);
      const res = await fetch(`/api/contact-messages/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !message.isRead }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (data.success) {
        setMessages(messages.map(m => 
          m.id === message.id ? { ...m, isRead: !m.isRead } : m
        ));
        toast.success(`Đã đánh dấu là ${!message.isRead ? 'đã đọc' : 'chưa đọc'}`);
      } else {
        toast.error(data.error || 'Không thể cập nhật tin nhắn');
      }
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Có lỗi khi cập nhật trạng thái tin nhắn');
    }
  };

  // Delete message
  const handleDelete = async (message: ContactMessage) => {
    if (!confirm('Bạn có chắc muốn xóa tin nhắn này không?')) return;

    try {
      console.log('Deleting message:', message.id);
      const res = await fetch(`/api/contact-messages/${message.id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', res.status);
      const data = await res.json();
      console.log('Delete response data:', data);

      if (data.success) {
        setMessages(messages.filter(m => m.id !== message.id));
        toast.success('Đã xóa tin nhắn');
        if (selectedMessage?.id === message.id) {
          setSelectedMessage(null);
          setShowModal(false);
        }
      } else {
        toast.error(data.error || 'Không thể xóa tin nhắn');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Có lỗi khi xóa tin nhắn');
    }
  };

  // View message details
  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
    if (!message.isRead) {
      handleMarkAsRead(message);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Quản lý tin nhắn liên hệ</h1>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="animate-spin h-5 w-5 text-white">
              <ClockIcon />
            </div>
          ) : (
            <span className="text-white/60">
              {messages.length} tin nhắn
            </span>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 transition-all ${message.isRead ? 'opacity-70' : ''}`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {message.name}
                    {!message.isRead && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </h3>
                  <span className="text-sm text-white/40">{formatDate(message.createdAt)}</span>
                </div>
                <p className="text-white/80">{message.email}</p>
                <p className="text-white/60 mt-2 line-clamp-2">{message.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkAsRead(message)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={message.isRead ? "Đánh dấu chưa đọc" : "Đánh dấu đã đọc"}
                >
                  {message.isRead ? (
                    <EyeSlashIcon className="w-5 h-5 text-white/60" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(message)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Xóa tin nhắn"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
                <button
                  onClick={() => handleViewMessage(message)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.name}</h2>
                <p className="text-white/60">{selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-sm">Thời gian gửi:</p>
                <p className="text-white">{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <p className="text-white/40 text-sm">Nội dung tin nhắn:</p>
                <p className="text-white whitespace-pre-wrap mt-2">{selectedMessage.message}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
