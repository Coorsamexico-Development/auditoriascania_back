import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GcsService } from '../storage/services/gcs.service';
import { EvidencesService } from './evidences.service';

@UseGuards(JwtAuthGuard)
@Controller('evidences')
export class EvidencesController {
  constructor(
    private readonly evidencesService: EvidencesService,
    private readonly gcsService: GcsService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(), // Buffer en RAM → se pasa directo a GCS
    }),
  )
  async uploadEvidences(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { pickingListId: string },
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const pickingListId = parseInt(body.pickingListId, 10);
    if (isNaN(pickingListId)) {
      throw new BadRequestException(
        'pickingListId is required and must be a valid number',
      );
    }

    // Subir cada archivo a GCS y obtener la URL pública
    const fileUrls = await Promise.all(
      files.map((file) => this.gcsService.uploadFile(file, 'evidences')),
    );

    await this.evidencesService.createMultiple(pickingListId, fileUrls);

    return {
      message: 'Archivos subidos con éxito',
      urls: fileUrls,
    };
  }
}
