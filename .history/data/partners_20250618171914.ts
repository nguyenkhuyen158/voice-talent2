import fs from 'fs';
import path from 'path';

export interface Partner {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
}

// Đọc dữ liệu từ file JSON
const partnersPath = path.join(process.cwd(), 'data', 'partners.json');
const partnersData = JSON.parse(fs.readFileSync(partnersPath, 'utf8'));

export const partners: Partner[] = partnersData.partners;
