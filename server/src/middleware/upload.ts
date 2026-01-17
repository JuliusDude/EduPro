import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ValidationError } from '../utils/errors';

// Ensure uploads directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});

// File filter for allowed types
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'text/plain',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ValidationError('Invalid file type. Allowed: PDF, DOCX, PPTX, Images, TXT'));
    }
};

// Assignment file upload (max 10MB)
export const uploadAssignment = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_ASSIGNMENT_FILE_SIZE || '10485760'), // 10MB
    },
});

// Notes file upload (max 25MB)
export const uploadNote = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_NOTE_FILE_SIZE || '26214400'), //25MB
    },
});

// Generic file upload
export const uploadFile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    },
});
