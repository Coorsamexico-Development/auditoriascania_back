import { PrismaService } from '../prisma/prisma.service';
import { PickingList } from '@prisma/client';
export declare class PickingListsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        number: string;
        userId: number;
    }): Promise<PickingList>;
    findAllByDate(date: string): Promise<PickingList[]>;
}
