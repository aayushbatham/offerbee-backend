import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/db.module';
import { VoucherModule } from './voucher/voucher.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [UserModule, DatabaseModule, VoucherModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
