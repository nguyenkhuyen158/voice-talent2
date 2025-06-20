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
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Media Manager</h1>
        <div className="flex gap-4">
          <button
            onClick={loadFiles}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Refresh
          </button>
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
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
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setCurrentDir('')}
          className="px-2 py-1 text-sm hover:bg-gray-100 rounded"
        >
          public
        </button>
        {currentDir.split('/').filter(Boolean).map((part, i, arr) => (
          <div key={i} className="flex items-center">
            <span>/</span>
            <button
              onClick={() => setCurrentDir(arr.slice(0, i + 1).join('/'))}
              className="px-2 py-1 text-sm hover:bg-gray-100 rounded"
            >
              {part}
            </button>
          </div>
        ))}
      </div>

      {/* File List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Modified</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentDir && (
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button
                    onClick={navigateUp}
                    className="flex items-center gap-2 text-gray-900"
                  >
                    <FolderIcon className="w-5 h-5 text-gray-400" />
                    ..
                  </button>
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
              </tr>
            )}
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file.path} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {renameMode === file.path ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(file)}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setRenameMode(null);
                            setNewName('');
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => file.isDirectory && navigateToFolder(file)}
                        className="flex items-center gap-2 text-gray-900"
                      >
                        {file.isDirectory ? (
                          <FolderIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                          <DocumentIcon className="w-5 h-5 text-gray-400" />
                        )}
                        {file.name}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {file.isDirectory ? '-' : formatSize(file.size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(file.lastModified)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex justify-end gap-2">
                      {!file.isDirectory && (
                        <button
                          onClick={() => handleCopy(file)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Copy"
                        >
                          <DocumentDuplicateIcon className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setRenameMode(file.path);
                          setNewName(file.name);
                        }}
                        className="text-yellow-600 hover:text-yellow-700"
                        title="Rename"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
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
