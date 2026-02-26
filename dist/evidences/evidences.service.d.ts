import { PrismaService } from '../prisma/prisma.service';
export declare class EvidencesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(pickingListId: number, fileUrl: string): Promise<{
        id: number;
        createdAt: Date;
        pickingListId: number;
        fileUrl: string;
    }>;
    createMultiple(pickingListId: number, fileUrls: string[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
