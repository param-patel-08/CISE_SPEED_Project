import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './api/mongo/mongo.module';

@Module({
  imports: [MongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}