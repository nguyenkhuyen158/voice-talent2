'use client';
import { Toaster } from 'react-hot-toast';

export default function AdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}
