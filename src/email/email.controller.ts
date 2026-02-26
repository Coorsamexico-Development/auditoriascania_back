import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Post('send')
    async sendPickingList(
        @Body() body: { to: string; subject: string; message: string; pickingListId: number }
    ) {
        return this.emailService.sendPickingListEmail(
            body.to,
            body.subject,
            body.message,
            body.pickingListId
        );
    }
}
