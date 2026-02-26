import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { PickingListsService } from './picking-lists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('picking-lists')
export class PickingListsController {
    constructor(private readonly pickingListsService: PickingListsService) { }

    @Post()
    create(@Body() createPickingListDto: { number: string }, @Request() req: any) {
        return this.pickingListsService.create({
            number: createPickingListDto.number,
            userId: req.user.id
        });
    }

    @Get()
    findAllByDate(@Query('date') date: string) {
        if (!date) {
            // Por defecto consultar el dia actual
            date = new Date().toISOString().split('T')[0];
        }
        return this.pickingListsService.findAllByDate(date);
    }
}
