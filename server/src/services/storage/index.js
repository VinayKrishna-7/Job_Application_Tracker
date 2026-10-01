import { env } from '../../config/env.js';
import { LocalStorageProvider } from './local.storage.js';
import { CloudinaryStorageProvider } from './cloudinary.storage.js';

let storageInstance = null;

export const getStorageService = () => {
  if (!storageInstance) {
    if (env.CLOUDINARY.isConfigured()) {
      console.log('[Storage] Initializing CloudinaryStorageProvider');
      storageInstance = new CloudinaryStorageProvider();
    } else {
      console.log('[Storage] Initializing LocalStorageProvider (uploads stored in /server/uploads)');
      storageInstance = new LocalStorageProvider();
    }
  }
  return storageInstance;
};

export const storageService = getStorageService();
