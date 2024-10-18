import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnModuleDestroy, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

export enum Users {
  Analyst = 'Analysis',
  Moderator = 'Moderation'
}

@Injectable()
export class ArticlesService implements OnModuleDestroy, OnModuleInit {
  private client: MongoClient;
  

  constructor(private readonly mailService: MailerService) {
    const uri = process.env.DBCONNECTIONSTRING;
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    ;
  }
  async onModuleInit() {
    await this.connect()
  }

  sendMail(article: {
    JournalName: string,
    Authors: string[],
    PubYear: number,
    Pages: string,
    SEPractice: string,
    Summary: string,
    Perspective: string,
  }, user: Users) {
    const message = `
        <p>Another publication is ready for <strong>${user}</strong>.</p>
        <p>Please review the following key details:</p>

        <ul>
            <li><strong>Journal Name:</strong> ${article.JournalName}</li>
            <li><strong>Authors:</strong> ${article.Authors.join(', ')}</li>
            <li><strong>Published Year:</strong> ${article.PubYear}</li>
            <li><strong>Pages:</strong> ${article.Pages}</li>
            <li><strong>SE Practice:</strong> ${article.SEPractice}</li>
            <li><strong>Summary:</strong> ${article.Summary}</li>
            <li><strong>Perspective:</strong> ${article.Perspective}</li>
        </ul>

        <p>Regards,</p>
        <p><strong>Speed @ AUT</strong></p>
    `;
    
    let recipient: string;

    switch(user)
    {
        case Users.Analyst:
            recipient = "wvz8937@autuni.ac.nz"
        case Users.Moderator:
            recipient = "tasmankeenan03@gmail.com"
    }
  
    this.mailService.sendMail({
        from: 'ada88@ethereal.email',
        to: recipient,
        subject: `Another Publication is ready for your review`,
        html: message,
        });
    console.log("email sent")  
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

  async getShortlistedArticles() {
    const collection = this.client.db('SPEED').collection('articles');

    try {
      const shortlistedArticles = await collection.find({ Status: 'Shortlisted' }).toArray();
      return shortlistedArticles;
    } catch (error) {
      throw new Error('Could not retrieve shortlisted articles');
    }
  }

  // Approve or reject an article
  async updateArticleStatus(id: string, status: 'Approved' | 'Rejected' | 'Shortlisted' | 'Pending') {

    // Enforce runtime validation for the status
    const validStatuses = ['Approved', 'Rejected', 'Shortlisted', 'Pending'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException("Invalid status. Must be 'Approved', 'Rejected', 'Shortlisted', or 'Pending'.");
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



  async searchArticles(query: string, filters: { SEPractice?: string[], Perspective?: number[], AfterPubYear?: number, BeforePubYear?: number }) {
    console.log('Query:', query);
    console.log('Filters:', JSON.stringify(filters, null, 2));
  
    const collection = this.client.db('SPEED').collection('articles');
    
    const searchCriteria: any = {};
    searchCriteria.Status = 'Approved';
    
    if (query) {
      console.log('Query provided');
      searchCriteria.$or = [
        { Title: { $regex: query, $options: 'i' } },
        { Authors: { $elemMatch: { $regex: query, $options: 'i' } } },
        { SEPractice: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (filters?.SEPractice?.length) {
      console.log('SEPractice filter applied');
      searchCriteria.SEPractice = { $in: filters.SEPractice };
    }
  
    if (filters?.Perspective?.length) {
      console.log('Perspective filter applied');
      searchCriteria.Perspective = { $in: filters.Perspective };
    }
  
    if (filters?.AfterPubYear != null) {
      console.log('AfterPubYear filter applied');
      searchCriteria.PubYear = { ...searchCriteria.PubYear, $gte: filters.AfterPubYear };
    }
  
    if (filters?.BeforePubYear != null) {
      console.log('BeforePubYear filter applied');
      searchCriteria.PubYear = { ...searchCriteria.PubYear, $lte: filters.BeforePubYear };
    }
  
    console.log('Search Criteria:', JSON.stringify(searchCriteria, null, 2));
  
    const searchResults = await collection.find(searchCriteria).limit(30).toArray();
  
    return searchResults;
  }
  
  async deleteArticleById(id: string): Promise<boolean> {
    const collection = this.client.db('SPEED').collection('articles');

    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });

    return result.deletedCount > 0;
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
    JournalName: string,
    Authors: string[],
    PubYear: number,
    Volume: string,
    Number: string,
    Pages: string,
    Link: string,
    SEPractice: string,
    Summary: string,
    Perspective: string,
  }) {

    let articleToBeInserted = {
      ...article,
      DOE: new Date(),
      Status: 'Pending',
      Impressions: 0
    }
    const collection = this.client.db('SPEED').collection('articles');
    let newArticle = await collection.insertOne(articleToBeInserted);
    
    this.sendMail(articleToBeInserted, Users.Moderator);

    return { status: 'Success', message: 'Article created successfully', details: newArticle };
  }

  

  // Create multiple new articles
  async createArticles(articles: {
    JournalName: string,
    Authors: string[],
    PubYear: number,
    Volume: string,
    Number: string,
    Pages: string,
    Link: string,
    SEPractice: string,
    Summary: string,
    Perspective: string,
  }[]) {
    const collection = this.client.db('SPEED').collection('articles');
    const newArticles = articles.map(article => ({
      ...article,
      DOE: new Date(),
      Status: 'Pending',
      Impressions: 0
    }));
    let result = await collection.insertMany(newArticles);
    return { status: 'Success', message: 'Articles created successfully', details: result };
  }


  async onModuleDestroy() {
    await this.client.close();
  }
}
