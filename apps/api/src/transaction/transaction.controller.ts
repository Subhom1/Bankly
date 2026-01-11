import { Controller, Post, Get, Body, UseGuards, Request, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Currency, TransactionType } from '@prisma/client';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post('transfer')
    async transfer(
        @Request() req: any,
        @Body('recipientEmail') recipientEmail: string,
        @Body('amount') amount: number,
        @Body('currency') currency: Currency,
    ) {
        return this.transactionService.transfer(req.user.userId, recipientEmail, amount, currency);
    }

    @Post('exchange')
    async exchange(
        @Request() req: any,
        @Body('fromCurrency') fromCurrency: Currency,
        @Body('toCurrency') toCurrency: Currency,
        @Body('fromAmount') fromAmount: number,
    ) {
        return this.transactionService.exchange(req.user.userId, fromCurrency, toCurrency, fromAmount);
    }

    @Get()
    async findAll(
        @Request() req: any,
        @Query('type') type?: TransactionType,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    ) {
        return this.transactionService.findAll(req.user.userId, type, page, limit);
    }
}
