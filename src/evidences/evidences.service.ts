import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvidencesService {
  constructor(private prisma: PrismaService) {}

  async create(pickingListId: number, fileUrl: string) {
    return this.prisma.evidence.create({
      data: {
        pickingListId,
        fileUrl,
      },
    });
  }

  async createMultiple(pickingListId: number, fileUrls: string[]) {
    const data = fileUrls.map((url) => ({
      pickingListId,
      fileUrl: url,
    }));
    return this.prisma.evidence.createMany({
      data,
    });
  }

  async createTemporary(fileUrl: string) {
    return this.prisma.temporaryEvidence.create({
      data: {
        fileUrl,
      },
    });
  }
}
