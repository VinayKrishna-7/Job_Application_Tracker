import { v2 as cloudinary } from 'cloudinary';
import { StorageProvider } from './storage.interface.js';
import { env } from '../../config/env.js';

export class CloudinaryStorageProvider extends StorageProvider {
  constructor() {
    super();
    cloudinary.config({
      cloud_name: env.CLOUDINARY.CLOUD_NAME,
      api_key: env.CLOUDINARY.API_KEY,
      api_secret: env.CLOUDINARY.API_SECRET,
    });
  }

  async upload(file, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: options.folder || 'easytrack',
        resource_type: options.resourceType || 'auto',
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            filename: file.originalname,
            size: result.bytes,
            mimetype: file.mimetype,
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async delete(fileIdentifier) {
    try {
      const res = await cloudinary.uploader.destroy(fileIdentifier);
      return res.result === 'ok';
    } catch (error) {
      console.warn(`[Cloudinary] Delete failed: ${error.message}`);
      return false;
    }
  }
}
