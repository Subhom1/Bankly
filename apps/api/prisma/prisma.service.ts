import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Called when NestJS module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Required by OnModuleDestroy
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Optional: allow graceful shutdown for Prisma hooks
  // async enableShutdownHooks(app: any) {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });
  // }
}
