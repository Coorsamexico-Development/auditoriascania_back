import { PrismaService } from '../prisma/prisma.service';
export declare class EmailService {
    private prisma;
    private transporter;
    private readonly logger;
    constructor(prisma: PrismaService);
    private getTransporter;
    sendPickingListEmail(to: string, subject: string, message: string, pickingListId: number): Promise<{
        success: boolean;
        messageId: any;
        previewUrl: string | false;
    }>;
}
