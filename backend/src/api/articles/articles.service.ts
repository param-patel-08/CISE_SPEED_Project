import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, OnModuleDestroy, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

// Define user roles for use within the service
export enum Users {
  Analyst = 'Analysis',
  Moderator = 'Moderation'
}

@Injectable()
export class ArticlesService implements OnModuleDestroy, OnModuleInit {
  private client: MongoClient;

  // Initialize the service with mailer and MongoDB client
  constructor(private readonly mailService: MailerService) {
    const uri = process.env.DBCONNECTIONSTRING;
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  // Method to handle initial setup
  async onModuleInit() {
    await this.connect();
  }

  // Send email notification based on the type of user
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

    // Determine the recipient based on the user role
    switch (user) {
      case Users.Analyst:
        recipient = "wvz8937@autuni.ac.nz";
        break;
      case Users.Moderator:
        recipient = "tasmankeenan03@gmail.com";
        break;
    }

    this.mailService.sendMail({
      from: 'ada88@ethereal.email',
      to: recipient,
      subject: `Another Publication is ready for your review`,
      html: message,
    });
    console.log("Email sent");
  }

  // Connect to MongoDB
  async connect() {
    await this.client.connect();
    await this.client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB!');
  }

  // Retrieve an article by its ID, incrementing impressions
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
  

  // Update the status of an article (approve, reject, etc.)
  async updateArticleStatus(id: string, status: 'Approved' | 'Rejected' | 'Shortlisted' | 'Pending' | 'Reported', reason: string ) {
    // Enforce runtime validation for the status
    const validStatuses = ['Approved', 'Rejected', 'Shortlisted', 'Pending', 'Reported'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException("Invalid status. Must be 'Approved', 'Rejected', 'Shortlisted', 'Reported', or 'Pending'.");
    }

    const collection = this.client.db('SPEED').collection('articles');

    if (!ObjectId.isValid(id)) {
      throw new BadRequestException("ObjectId is Invalid");
    }

    const ObID = new ObjectId(id);
    const result = await collection.updateOne(
      { _id: ObID },
      { $set: { Status: status, Reason: reason } }
    );

    return result.modifiedCount > 0 ? { status: 'Success' } : { status: 'Failed', message: 'Article not found or update failed' };
  }

  // Search for articles with optional filters
  async searchArticles(query: string, filters: { SEPractice?: string[], Perspective?: number[], AfterPubYear?: number, BeforePubYear?: number }) {
    console.log('Query:', query);
    console.log('Filters:', JSON.stringify(filters, null, 2));

    const collection = this.client.db('SPEED').collection('articles');
    const searchCriteria: any = {};
    searchCriteria.Status = 'Approved'; // Only include articles that are marked as 'Approved'

    // Check if there is a search query and apply it to the search criteria
    if (query) {
      console.log('Query provided');
      searchCriteria.$or = [
        { Title: { $regex: query, $options: 'i' } }, // Search within the title for the query string, case-insensitive
        { Authors: { $elemMatch: { $regex: query, $options: 'i' } } }, // Search within the authors array for a match
        { SEPractice: { $regex: query, $options: 'i' } } // Search within SE Practice field for the query string
      ];
    }

    // Check if there are any Software Engineering Practice Filters Applied
    if (filters?.SEPractice?.length) {
      console.log('SEPractice filter applied');
      searchCriteria.SEPractice = { $in: filters.SEPractice }; // Include only articles that match any of the specified SE Practices
    }

    // Check if there are any Perspective Filters Applied
    if (filters?.Perspective?.length) {
      console.log('Perspective filter applied');
      searchCriteria.Perspective = { $in: filters.Perspective }; // Include only articles with the specified perspectives
    }

    // Check if there is a filter for articles published after a specific year
    if (filters?.AfterPubYear != null) {
      console.log('AfterPubYear filter applied');
      searchCriteria.PubYear = { ...searchCriteria.PubYear, $gte: filters.AfterPubYear }; // Include articles published on or after the specified year
    }

    // Check if there is a filter for articles published before a specific year
    if (filters?.BeforePubYear != null) {
      console.log('BeforePubYear filter applied');
      searchCriteria.PubYear = { ...searchCriteria.PubYear, $lte: filters.BeforePubYear }; // Include articles published on or before the specified year
    }

    console.log('Search Criteria:', JSON.stringify(searchCriteria, null, 2));

    // Execute the search with the defined criteria and return up to 30 results
    const searchResults = await collection.find(searchCriteria).limit(30).toArray();
    return searchResults;
  }


  // Delete an article by its ID
  async deleteArticleById(id: string): Promise<boolean> {
    const collection = this.client.db('SPEED').collection('articles');

    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }

    const objectId = new ObjectId(id);
    const result = await collection.deleteOne({ _id: objectId });

    return result.deletedCount > 0;
  }

  // Fetch articles by status
  async getArticles(status: 'Approved' | 'Rejected' | 'Shortlisted' | 'Pending' | 'Reported') {
    const collection = this.client.db('SPEED').collection('articles');

    try {
      const articles = await collection.find({ Status: status }).toArray();
      return articles;
    } catch (error) {
      throw new Error('Could not retrieve pending articles');
    }
  }

  // Create a new article and notify the moderator
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
      Impressions: 0,
      Reason: "Article just submitted to SPEED", 
    };
    const collection = this.client.db('SPEED').collection('articles');
    let newArticle = await collection.insertOne(articleToBeInserted);

    this.sendMail(articleToBeInserted, Users.Moderator);

    return { status: 'Success', message: 'Article created successfully', details: newArticle };
  }

  // Create multiple new articles in bulk
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

  // Handle cleanup tasks on module destruction
  async onModuleDestroy() {
    await this.client.close();
  }
}
