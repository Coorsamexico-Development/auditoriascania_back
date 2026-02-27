import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
    FileInterceptor('file', {
      storage: memoryStorage(), // Buffer en RAM → se pasa directo a GCS
    }),
  )
  async uploadEvidence(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Subir el archivo a GCS y obtener la URL pública
    const fileUrl = await this.gcsService.uploadFile(file, 'evidences');

    // Guardar el registro TEMPORAL en la base de datos
    const tempEvidence = await this.evidencesService.createTemporary(fileUrl);

    return {
      message: 'Evidencia temporal creada con éxito',
      id: tempEvidence.id,
      url: fileUrl,
    };
  }
}
