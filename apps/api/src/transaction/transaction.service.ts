import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Currency, TransactionType, Prisma } from '@prisma/client';
import Decimal = Prisma.Decimal;

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) { }

    async transfer(senderId: number, recipientEmail: string, amount: number, currency: Currency) {
        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Find sender's account
            const senderAccount = await tx.account.findFirst({
                where: { userId: senderId, currency },
            });

            if (!senderAccount) {
                throw new NotFoundException(`Sender ${currency} account not found`);
            }

            const decimalAmount = new Decimal(amount).toDecimalPlaces(2);

            if (senderAccount.balance.lt(decimalAmount)) {
                throw new BadRequestException('Insufficient funds');
            }

            // 2. Find recipient
            const recipient = await tx.user.findUnique({
                where: { email: recipientEmail },
            });

            if (!recipient) {
                throw new NotFoundException('Recipient user not found');
            }

            if (recipient.id === senderId) {
                throw new BadRequestException('Cannot transfer to yourself');
            }

            // 3. Find recipient's account
            const recipientAccount = await tx.account.findFirst({
                where: { userId: recipient.id, currency },
            });

            if (!recipientAccount) {
                throw new BadRequestException(`Recipient does not have a ${currency} account`);
            }

            // 4. Perform balance updates
            await tx.account.update({
                where: { id: senderAccount.id },
                data: { balance: { decrement: decimalAmount } },
            });

            await tx.account.update({
                where: { id: recipientAccount.id },
                data: { balance: { increment: decimalAmount } },
            });

            // 5. Create Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    type: TransactionType.TRANSFER,
                    amount: decimalAmount,
                },
            });

            // 6. Create Ledger entries
            await tx.ledger.createMany({
                data: [
                    {
                        accountId: senderAccount.id,
                        transactionId: transaction.id,
                        amount: decimalAmount.mul(-1),
                    },
                    {
                        accountId: recipientAccount.id,
                        transactionId: transaction.id,
                        amount: decimalAmount,
                    },
                ],
            });

            return transaction;
        });
    }

    async exchange(userId: number, fromCurrency: Currency, toCurrency: Currency, fromAmount: number) {
        if (fromCurrency === toCurrency) {
            throw new BadRequestException('Cannot exchange to the same currency');
        }

        if (fromAmount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        // Rate: 1 USD = 0.92 EUR
        const USD_TO_EUR = new Decimal(0.92);
        const EUR_TO_USD = new Decimal(1).div(USD_TO_EUR);

        return this.prisma.$transaction(async (tx) => {
            // 1. Find accounts
            const fromAccount = await tx.account.findFirst({
                where: { userId, currency: fromCurrency },
            });

            const toAccount = await tx.account.findFirst({
                where: { userId, currency: toCurrency },
            });

            if (!fromAccount || !toAccount) {
                throw new NotFoundException('Source or target account not found');
            }

            const decimalFromAmount = new Decimal(fromAmount).toDecimalPlaces(2);

            if (fromAccount.balance.lt(decimalFromAmount)) {
                throw new BadRequestException('Insufficient funds');
            }

            // 2. Calculate toAmount
            let toAmount: Decimal;
            if (fromCurrency === Currency.USD && toCurrency === Currency.EUR) {
                toAmount = decimalFromAmount.mul(USD_TO_EUR).toDecimalPlaces(2);
            } else {
                toAmount = decimalFromAmount.mul(EUR_TO_USD).toDecimalPlaces(2);
            }

            // 3. Update balances
            await tx.account.update({
                where: { id: fromAccount.id },
                data: { balance: { decrement: decimalFromAmount } },
            });

            await tx.account.update({
                where: { id: toAccount.id },
                data: { balance: { increment: toAmount } },
            });

            // 4. Create Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    type: TransactionType.EXCHANGE,
                    amount: decimalFromAmount, // We record the source amount
                },
            });

            // 5. Create Ledger entries
            await tx.ledger.createMany({
                data: [
                    {
                        accountId: fromAccount.id,
                        transactionId: transaction.id,
                        amount: decimalFromAmount.mul(-1),
                    },
                    {
                        accountId: toAccount.id,
                        transactionId: transaction.id,
                        amount: toAmount,
                    },
                ],
            });

            return transaction;
        });
    }

    async findAll(userId: number, type?: TransactionType, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const where = {
            ledger: {
                some: {
                    account: {
                        userId,
                    },
                },
            },
            ...(type && { type }),
        };

        const [transactions, total] = await Promise.all([
            this.prisma.transaction.findMany({
                where,
                include: {
                    ledger: {
                        include: {
                            account: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.transaction.count({ where }),
        ]);

        return {
            data: transactions,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }
}
