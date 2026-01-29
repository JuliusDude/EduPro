import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
const notesDir = path.join(uploadsDir, 'notes');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, notesDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter for PDFs
const pdfFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

// Multer instance for note uploads (PDFs up to 10MB)
export const noteUpload = multer({
    storage,
    fileFilter: pdfFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

export const getFileUrl = (filename: string): string => {
    return `/uploads/notes/${filename}`;
};

export default { noteUpload, getFileUrl };
