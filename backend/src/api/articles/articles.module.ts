import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [ArticlesService],
  controllers: [ArticlesController],
  imports:[MailerModule.forRoot({
    transport: {
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: 'ada88@ethereal.email',
        pass: 'KpsuNr9EUg5aAharz5',
      },
        },
      }),]
  
})
export class ArticlesModules {}