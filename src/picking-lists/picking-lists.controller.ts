import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PickingListsService } from './picking-lists.service';

@UseGuards(JwtAuthGuard)
@Controller('picking-lists')
export class PickingListsController {
  constructor(private readonly pickingListsService: PickingListsService) {}

  @Post()
  create(
    @Body()
    createPickingListDto: { number: string; temporaryEvidenceIds?: number[] },
    @Request() req: any,
  ) {
    return this.pickingListsService.create({
      number: createPickingListDto.number,
      userId: req.user.id,
      temporaryEvidenceIds: createPickingListDto.temporaryEvidenceIds,
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
