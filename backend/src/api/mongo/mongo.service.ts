import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { MongoClient, ServerApiVersion } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleDestroy {
  private client: MongoClient;

  constructor() {
    const uri = process.env.DBCONNECTIONSTRING;
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  async connect() {
    await this.client.connect();
    await this.client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}