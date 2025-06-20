'use client';
import { useState, useEffect } from 'react';
import {
  FolderIcon,
  DocumentIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface File {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  lastModified: string;
}

const isImageFile = (filename: string) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

export default function MediaPage() {
  const [currentDir, setCurrentDir] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [renameMode, setRenameMode] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media?dir=' + currentDir);
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [currentDir]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      setUploading(true);
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dir', currentDir);

        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Upload failed');
        }
      }
      await loadFiles();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (file: File) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/media?path=' + file.path, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Delete failed');
      }

      await loadFiles();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Delete failed');
    }
  };

  const handleRename = async (file: File) => {
    if (!newName) return;

    try {
      const newPath = file.path.replace(file.name, newName);
      const res = await fetch('/api/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPath: file.path,
          newPath,
        }),
      });

      if (!res.ok) {
        throw new Error('Rename failed');
      }

      setRenameMode(null);
      setNewName('');
      await loadFiles();
    } catch (error) {
      console.error('Error renaming:', error);
      alert('Rename failed');
    }
  };

  const handleCopy = async (file: File) => {
    try {
      const baseName = file.name.replace(/(\.[^.]+)$/, '');
      const ext = file.name.match(/(\.[^.]+)$/)?.[1] || '';
      let newPath = file.path.replace(file.name, baseName + '_copy' + ext);
      
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: file.path,
          operation: 'copy',
          destination: newPath,
        }),
      });

      if (!res.ok) {
        throw new Error('Copy failed');
      }

      await loadFiles();
    } catch (error) {
      console.error('Error copying:', error);
      alert('Copy failed');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const navigateToFolder = (folder: File) => {
    if (folder.isDirectory) {
      setCurrentDir(folder.path);
    }
  };

  const navigateUp = () => {
    const parentDir = currentDir.split('/').slice(0, -1).join('/');
    setCurrentDir(parentDir);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Quản lý media</h1>
        <div className="flex gap-4">
          <button
            onClick={loadFiles}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Làm mới
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white cursor-pointer">
            <ArrowUpTrayIcon className="w-5 h-5" />
            Upload
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-white/70">
        <button
          onClick={() => setCurrentDir('')}
          className="px-2 py-1 text-sm hover:bg-white/10 rounded"
        >
          public
        </button>
        {currentDir.split('/').filter(Boolean).map((part, i, arr) => (
          <div key={i} className="flex items-center">
            <span>/</span>
            <button
              onClick={() => setCurrentDir(arr.slice(0, i + 1).join('/'))}
              className="px-2 py-1 text-sm hover:bg-white/10 rounded"
            >
              {part}
            </button>
          </div>
        ))}
      </div>
      {/* File List */}
      <div className="glass-card rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Tên</th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Kích thước</th>
              <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-white/60 uppercase">Cập nhật</th>
              <th scope="col" className="hidden md:table-cell px-6 py-3 text-center text-xs font-medium text-white/60 uppercase">Xem trước</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white/60 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {currentDir && (
              <tr className="hover:bg-white/5 transition-all">
                <td className="px-6 py-4">
                  <button
                    onClick={navigateUp}
                    className="flex items-center gap-2 text-white"
                  >
                    <FolderIcon className="w-5 h-5 text-white/40" />
                    ..
                  </button>
                </td>
                <td className="hidden md:table-cell"></td>
                <td className="hidden lg:table-cell"></td>
                <td className="hidden md:table-cell"></td>
                <td></td>
              </tr>
            )}
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-white/60">Đang tải...</td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file.path} className="hover:bg-white/5 transition-all">
                  <td className="px-6 py-4">
                    {renameMode === file.path ? (
                      <div className="flex items-center space-x-3 bg-white/10 p-2 rounded-lg">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="block w-full px-3 py-2 text-white placeholder-white/60 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/5 shadow-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(file)}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => {
                            setRenameMode(null);
                            setNewName('');
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => file.isDirectory && navigateToFolder(file)}
                        className="flex items-center gap-2 text-white"
                      >
                        {file.isDirectory ? (
                          <FolderIcon className="w-5 h-5 text-white/40" />
                        ) : (
                          <DocumentIcon className="w-5 h-5 text-white/40" />
                        )}
                        {file.name}
                      </button>
                    )}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-sm text-white/60">
                    {file.isDirectory ? '-' : formatSize(file.size)}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 text-sm text-white/60">
                    {formatDate(file.lastModified)}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-center">
                    {!file.isDirectory && isImageFile(file.name) ? (
                      <div className="relative group">
                        <img
                          src={`/${file.path}`}
                          alt={file.name}
                          className="w-10 h-10 object-contain mx-auto cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => window.open(`/${file.path}`, '_blank')}
                        />
                        <div className="hidden group-hover:block absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                          <img
                            src={`/${file.path}`}
                            alt={file.name}
                            className="max-w-[200px] max-h-[200px] object-contain bg-white rounded-lg shadow-lg border border-white/10"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/40 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      {!file.isDirectory && (
                        <button
                          onClick={() => handleCopy(file)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Sao chép"
                        >
                          <DocumentDuplicateIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setRenameMode(file.path);
                          setNewName(file.name);
                        }}
                        className="text-yellow-400 hover:text-yellow-300"
                        title="Đổi tên"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="text-red-500 hover:text-red-400"
                        title="Xóa"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
