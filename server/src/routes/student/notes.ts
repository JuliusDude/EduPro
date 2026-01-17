import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../../services/prisma';
import { authenticate } from '../../middleware/auth';
import { requireRole } from '../../middleware/roleGuard';
import { uploadNote } from '../../middleware/upload';
import { NotFoundError, ValidationError } from '../../utils/errors';
import path from 'path';
import fs from 'fs';

const router = Router();

router.use(authenticate);
router.use(requireRole('STUDENT'));

/**
 * GET /api/student/notes
 * Get all notes (personal + course materials)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { subjectId, folderId } = req.query;

        let whereClause: any = {
            OR: [
                { uploadedBy: userId, noteType: 'PERSONAL_NOTE' },
                { isPublic: true, noteType: 'COURSE_MATERIAL' },
            ],
        };

        if (subjectId) {
            whereClause.subjectId = subjectId;
        }

        if (folderId) {
            whereClause.folderId = folderId;
        }

        const notes = await prisma.note.findMany({
            where: whereClause,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                folder: {
                    select: {
                        id: true,
                        name: true,
                        color: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: { notes },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/student/notes/folders
 * Get folder structure for student
 */
router.get('/folders', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;

        const folders = await prisma.folder.findMany({
            where: {
                userId,
                parentFolderId: null, // Get root folders only
            },
            include: {
                subfolders: true,
                notes: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        const foldersWithCount = folders.map((folder) => ({
            id: folder.id,
            name: folder.name,
            color: folder.color,
            filesCount: folder.notes.length,
            subfoldersCount: folder.subfolders.length,
        }));

        res.json({
            success: true,
            data: { folders: foldersWithCount },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/student/notes/folders
 * Create new folder
 */
router.post('/folders', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { name, color, parentFolderId } = req.body;

        if (!name) {
            throw new ValidationError('Folder name is required');
        }

        const folder = await prisma.folder.create({
            data: {
                name,
                color: color || null,
                userId,
                parentFolderId: parentFolderId || null,
            },
        });

        res.json({
            success: true,
            message: 'Folder created successfully',
            data: { folder },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/student/notes/upload
 * Upload personal note
 */
router.post(
    '/upload',
    uploadNote.single('file'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const file = req.file;
            const { title, description, subjectId, folderId } = req.body;

            if (!file) {
                throw new ValidationError('File is required');
            }

            if (!title) {
                throw new ValidationError('Title is required');
            }

            const note = await prisma.note.create({
                data: {
                    title,
                    description: description || null,
                    uploadedBy: userId,
                    noteType: 'PERSONAL_NOTE',
                    subjectId: subjectId || null,
                    folderId: folderId || null,
                    fileUrl: `/uploads/${file.filename}`,
                    fileName: file.originalname,
                    fileSize: file.size,
                    mimeType: file.mimetype,
                    isPublic: false,
                },
            });

            res.json({
                success: true,
                message: 'Note uploaded successfully',
                data: { note },
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /api/student/notes/:id/download
 * Download note file
 */
router.get('/:id/download', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const note = await prisma.note.findFirst({
            where: {
                id,
                OR: [
                    { uploadedBy: userId },
                    { isPublic: true },
                ],
            },
        });

        if (!note) {
            throw new NotFoundError('Note not found or access denied');
        }

        // Increment download count
        await prisma.note.update({
            where: { id },
            data: { downloadCount: note.downloadCount + 1 },
        });

        const filePath = path.join(__dirname, '../../../', note.fileUrl);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundError('File not found on server');
        }

        res.download(filePath, note.fileName);
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/student/notes/:id
 * Delete personal note
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user!.userId;

        const note = await prisma.note.findFirst({
            where: {
                id,
                uploadedBy: userId,
                noteType: 'PERSONAL_NOTE',
            },
        });

        if (!note) {
            throw new NotFoundError('Note not found or you do not have permission to delete it');
        }

        // Delete file from filesystem
        const filePath = path.join(__dirname, '../../../', note.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await prisma.note.delete({ where: { id } });

        res.json({
            success: true,
            message: 'Note deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

export default router;
