import { PickingListsService } from './picking-lists.service';
export declare class PickingListsController {
    private readonly pickingListsService;
    constructor(pickingListsService: PickingListsService);
    create(createPickingListDto: {
        number: string;
    }, req: any): Promise<{
        number: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }>;
    findAllByDate(date: string): Promise<{
        number: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }[]>;
}
