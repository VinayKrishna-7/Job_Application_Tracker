import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_DOC_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        ApiError.badRequest(
          'Invalid file type. Only PDF, DOC, and DOCX documents are supported.',
          'INVALID_FILE_TYPE'
        ),
        false
      );
    }
  },
});

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        ApiError.badRequest(
          'Invalid file type. Only JPG, PNG, and WebP images are supported.',
          'INVALID_IMAGE_TYPE'
        ),
        false
      );
    }
  },
});
