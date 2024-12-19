import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/db.module';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [UserModule, DatabaseModule, VoucherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
