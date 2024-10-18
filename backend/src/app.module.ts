import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModules } from './api/articles/articles.module';

@Module({
  imports: [ArticlesModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}