import { Controller, Get } from '@nestjs/common';
import { MongoService } from './mongo.service';

@Controller('mongo')
export class MongoController {
  constructor(private readonly mongoService: MongoService) {}

  @Get('ping')
  async ping() {
    await this.mongoService.connect();
    return 'Pinged your deployment. You successfully connected to MongoDB!';
  }
}