import { Injectable, OnModuleDestroy, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

@Injectable()
export class ArticlesService implements OnModuleDestroy, OnModuleInit {
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
  async onModuleInit() {
    await this.connect()
  }

  async connect() {
    await this.client.connect();
    await this.client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  }

  // Get all approved articles
  async getAllApprovedArticles() {
    const collection = this.client.db('SPEED').collection('articles');
    const approvedArticles = await collection.find({ Status: 'Approved' }).toArray();
    return approvedArticles;
  }

  // Get article by ID
  async getArticleById(id: string) {
    const collection = this.client.db('SPEED').collection('articles');
    
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException("ObjectId is invalid format");
    }
  
    const ObID = new ObjectId(id);
  
    const result = await collection.findOneAndUpdate(
      { _id: ObID },
      { $inc: { Impressions: 1 } }
    );
  
    if (!result) {
      throw new NotFoundException('Article not found');
    }
  
    return result;
  }
  // Approve or reject an article
  async updateArticleStatus(id: string, status: 'Approved' | 'Rejected') {

    // Enforce runtime validation for the status
    const validStatuses = ['Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException("Invalid status. Must be 'Approved' or 'Rejected'.");
    }
  
    const collection = this.client.db('SPEED').collection('articles');
    
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException("ObjectId is Invalid");
    }
    
    const ObID = new ObjectId(id);
    
    const result = await collection.updateOne(
      { _id: ObID },
      { $set: { Status: status } }
    );
    
    return result.modifiedCount > 0 ? 
      { status: 'Success' } : 
      { status: 'Failed', message: 'Article not found or update failed' };
  }

  // Search articles by query (limit 30 results)
  async searchArticles(query: string) {
    const collection = this.client.db('SPEED').collection('articles');
    const searchResults = await collection.find({ 
      $or: [
        { Title: { $regex: query, $options: 'i' } }, 
        { Authors: { $elemMatch: { $regex: query, $options: 'i' } } },
        { SEPractice: { $regex: query, $options: 'i' } },
        { Status: 'Accepted'}
      ]
    })
    .limit(30)
    .toArray();
    return searchResults;
  }

  // Get all pending articles
  async getPendingArticles() {
    const collection = this.client.db('SPEED').collection('articles');
    
    try {
      const pendingArticles = await collection.find({ Status: 'Pending' }).toArray();
      return pendingArticles;
    } catch (error) {
      throw new Error('Could not retrieve pending articles');
    }
  }


  // Create a new article
  async createArticle(article: {
    Title: string;
    Authors: string[];
    Source: string;
    PubYear: string;
    SEPractice: string;
    Perspective: string;
  }) {
    const collection = this.client.db('SPEED').collection('articles');
    try {
      let newArticle = await collection.insertOne({ 
        ...article,
        DOE: new Date(),
        Status: 'Pending',
        Impressions: 0
      });
      return { status: 'Success', message: 'Article created successfully', details: newArticle};
    } catch (error) {
      return { status: 'Failed', message: error.message };
    }
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
