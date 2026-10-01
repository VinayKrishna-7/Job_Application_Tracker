/**
 * Abstract Storage Service Interface
 */
export class StorageProvider {
  /**
   * Upload file
   * @param {Object} file - Express multer file object
   * @param {Object} options - Additional upload options
   * @returns {Promise<{ url: string, publicId?: string, filename: string, size: number, mimetype: string }>}
   */
  async upload(file, options = {}) {
    throw new Error('Method upload() must be implemented');
  }

  /**
   * Delete file
   * @param {string} fileIdentifier - File path or public ID
   * @returns {Promise<boolean>}
   */
  async delete(fileIdentifier) {
    throw new Error('Method delete() must be implemented');
  }
}
