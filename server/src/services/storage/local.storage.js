import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { StorageProvider } from './storage.interface.js';
import { env } from '../../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../../uploads');

export class LocalStorageProvider extends StorageProvider {
  constructor() {
    super();
    // Ensure uploads directory exists
    fs.mkdir(UPLOADS_DIR, { recursive: true }).catch((err) => {
      console.error('[LocalStorage] Failed to create uploads directory:', err);
    });
  }

  async upload(file, options = {}) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const filename = `${options.prefix || 'file'}-${uniqueSuffix}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    if (file.buffer) {
      await fs.writeFile(filepath, file.buffer);
    } else if (file.path) {
      await fs.copyFile(file.path, filepath);
    }

    const host = env.CLIENT_URL ? '' : `http://localhost:${env.PORT}`;
    const url = `/uploads/${filename}`;

    return {
      url,
      publicId: filename,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async delete(fileIdentifier) {
    try {
      const filename = path.basename(fileIdentifier);
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.unlink(filepath);
      return true;
    } catch (error) {
      console.warn(`[LocalStorage] File could not be deleted (${fileIdentifier}): ${error.message}`);
      return false;
    }
  }
}
