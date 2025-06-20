import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dir = searchParams.get('dir') || '';
  const fullPath = path.join(publicDir, dir);

  try {
    const stats = await fs.stat(fullPath);
    if (!stats.isDirectory()) {
      return NextResponse.json({ error: 'Not a directory' }, { status: 400 });
    }

    const files = await fs.readdir(fullPath);
    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(fullPath, file);
        const stats = await fs.stat(filePath);
        return {
          name: file,
          path: path.join(dir, file).replace(/\\/g, '/'),
          isDirectory: stats.isDirectory(),
          size: stats.size,
          lastModified: stats.mtime
        };
      })
    );

    return NextResponse.json({ files: fileDetails });
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const dir = formData.get('dir') as string | null;
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const targetDir = path.join(publicDir, dir || '');
  const filePath = path.join(targetDir, file.name);

  try {
    await fs.writeFile(filePath, buffer);
    return NextResponse.json({ success: true, path: path.join(dir || '', file.name).replace(/\\/g, '/') });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 });
  }

  const fullPath = path.join(publicDir, filePath);

  try {
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true });
    } else {
      await fs.unlink(fullPath);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { oldPath, newPath } = await request.json();

  if (!oldPath || !newPath) {
    return NextResponse.json({ error: 'Missing path information' }, { status: 400 });
  }

  const oldFullPath = path.join(publicDir, oldPath);
  const newFullPath = path.join(publicDir, newPath);

  try {
    await fs.rename(oldFullPath, newFullPath);
    return NextResponse.json({ success: true, newPath: newPath.replace(/\\/g, '/') });
  } catch (error) {
    console.error('Error moving/renaming:', error);
    return NextResponse.json({ error: 'Failed to move/rename' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { path: filePath, operation, destination } = await request.json();

  if (!filePath || !operation) {
    return NextResponse.json({ error: 'Missing required information' }, { status: 400 });
  }

  const sourcePath = path.join(publicDir, filePath);

  try {
    if (operation === 'copy' && destination) {
      const destPath = path.join(publicDir, destination);
      const content = await fs.readFile(sourcePath);
      await fs.writeFile(destPath, content);
      return NextResponse.json({ success: true, newPath: destination.replace(/\\/g, '/') });
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
  } catch (error) {
    console.error('Error performing operation:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
