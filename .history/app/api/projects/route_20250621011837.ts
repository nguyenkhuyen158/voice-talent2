import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Project } from '@/data/tmp/projects';

const projectsPath = path.join(process.cwd(), 'data', 'tmp', 'projects.json');

// Helper function to read and write JSON file
async function readProjectsFile() {
  const fileContents = await fs.readFile(projectsPath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeProjectsFile(data: any) {
  await fs.writeFile(projectsPath, JSON.stringify(data, null, 2));
}

// GET - Read all projects
export async function GET() {
  try {
    const projects = await readProjectsFile();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const { project } = await request.json();
    const data = await readProjectsFile();
    
    data.projects.push(project);
    await writeProjectsFile(data);

    return NextResponse.json({ message: 'Project created successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT - Update existing project
export async function PUT(request: NextRequest) {
  try {
    const { project, id } = await request.json();
    const data = await readProjectsFile();
    
    if (id < 0 || id >= data.projects.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    data.projects[id] = project;
    await writeProjectsFile(data);

    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const data = await readProjectsFile();
    
    if (id < 0 || id >= data.projects.length) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    data.projects.splice(id, 1);
    await writeProjectsFile(data);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
