export interface Project {
  title: string;
  type: string;
  year: string;
  url: string;
  voice: 'north' | 'south';
  category: string;
  partner: string;
}

export interface ProjectsData {
  projects: Project[];
}
