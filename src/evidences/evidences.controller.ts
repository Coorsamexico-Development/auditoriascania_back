import { Controller, Post, UseInterceptors, UploadedFiles, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EvidencesService } from './evidences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

// Asegurar que exista la carpeta uploads
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

@UseGuards(JwtAuthGuard)
@Controller('evidences')
export class EvidencesController {
    constructor(private readonly evidencesService: EvidencesService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: uploadDir,
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
    }))
    async uploadEvidences(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: { pickingListId: string }
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }
        const pickingListId = parseInt(body.pickingListId, 10);
        if (isNaN(pickingListId)) {
            throw new BadRequestException('pickingListId is required and must be a valid number');
        }

        // Devolvemos URLs relativas para acceder desde el frontend
        const fileUrls = files.map(file => `/uploads/${file.filename}`);

        await this.evidencesService.createMultiple(pickingListId, fileUrls);

        return {
            message: 'Archivos subidos con éxito',
            urls: fileUrls
        };
    }
}
