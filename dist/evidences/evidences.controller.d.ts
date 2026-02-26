import { EvidencesService } from './evidences.service';
export declare class EvidencesController {
    private readonly evidencesService;
    constructor(evidencesService: EvidencesService);
    uploadEvidences(files: Array<Express.Multer.File>, body: {
        pickingListId: string;
    }): Promise<{
        message: string;
        urls: string[];
    }>;
}
