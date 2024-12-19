import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://aayush:12345@atlascluster.i90q0bw.mongodb.net/voucher-service"),
  ],
})
export class DatabaseModule implements OnModuleInit {
  async onModuleInit() {
    mongoose.connection.once('open', () => {
      console.log('✅ Successfully connected to the MongoDB database');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
  }
}
