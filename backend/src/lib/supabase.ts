import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

const UPLOAD_DIR = path.join(__dirname, '../../uploads/baremos');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function uploadBaremPdf(userId: string, file: Buffer, fileName: string): Promise<{ url: string; localPath: string }> {
  const filePath = `${userId}-${Date.now()}-${fileName}`;
  const fullPath = path.join(UPLOAD_DIR, filePath);
  
  fs.writeFileSync(fullPath, file);
  
  return {
    url: `/uploads/baremos/${filePath}`,
    localPath: fullPath
  };
}

export async function deleteBaremPdf(filePath: string): Promise<void> {
  const fullPath = path.join(__dirname, '../../', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}
