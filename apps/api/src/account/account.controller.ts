import { Controller, Get, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
    constructor(private readonly accountService: AccountService) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.accountService.findAll(req.user.userId);
    }

    @Get(':id/balance')
    async getBalance(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
        const account = await this.accountService.findOne(req.user.userId, id);
        return {
            balance: account.balance,
            currency: account.currency,
        };
    }
}
