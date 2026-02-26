import { Module } from '@nestjs/common';
import { PickingListsService } from './picking-lists.service';
import { PickingListsController } from './picking-lists.controller';

@Module({
    controllers: [PickingListsController],
    providers: [PickingListsService],
    exports: [PickingListsService]
})
export class PickingListsModule { }
