import { EmailService } from './email.service';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendPickingList(body: {
        to: string;
        subject: string;
        message: string;
        pickingListId: number;
    }): Promise<{
        success: boolean;
        messageId: any;
        previewUrl: string | false;
    }>;
}
