import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(userId: number) {
        return this.prisma.account.findMany({
            where: { userId },
        });
    }

    async findOne(userId: number, accountId: number) {
        const account = await this.prisma.account.findFirst({
            where: { id: accountId, userId },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        return account;
    }
}
