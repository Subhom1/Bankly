import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [PrismaModule, AuthModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
