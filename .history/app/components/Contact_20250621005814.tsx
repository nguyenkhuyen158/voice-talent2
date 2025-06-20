'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ContactData } from '../../data/tmp/contact';
import { useState, useEffect } from 'react';

export default function Contact() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  
  useEffect(() => {
    async function fetchContact() {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setContactData(data.contact);
    }
    fetchContact();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!contactData?.social.email.name) {
      alert('Không tìm thấy email nhận liên hệ!');
      return;
    }

    try {
      const res = await fetch('/api/contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          to: contactData.social.email.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Gửi tin nhắn thành công!');
        form.reset();
      } else {
        alert('Gửi tin nhắn thất bại!');
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi gửi tin nhắn!');
    }
  }

  return (
    <section id="contact" className="scroll-section py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Liên Hệ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Copy the Contact Form and Contact Info JSX from the original file */}
          {/* Remember to add name attributes to form inputs and update the form onSubmit handler */}
        </div>
      </div>
    </section>
  );
}
