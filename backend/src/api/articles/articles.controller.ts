import { Controller, Get, Param, Post, Put, Body, Query, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Endpoint to ping the MongoDB server to check the connection
  @Get('ping')
  async ping() {
    await this.articlesService.connect();
    return 'Pinged your deployment. You successfully connected to MongoDB!';
  }

  // Endpoint to delete an article by its ID
  @Delete()
  async deleteArticle(@Query('id') id: string) {
    const result = await this.articlesService.deleteArticleById(id);
    if (!result) {
      throw new NotFoundException('Article not found'); // Throw error if the article does not exist
    }
    return { message: 'Article deleted successfully' };
  }

  // Endpoint to retrieve all approved articles
  @Get()
  async getAllApprovedArticles() {
    return await this.articlesService.getArticles('Approved');
  }

  // Endpoint to get a single article by its ID
  @Get('article')
  async getArticleByID(@Query('id') id: string) {
    const article = await this.articlesService.getArticleById(id);
    if (article) {
      return article;
    } else {
      throw new BadRequestException(); // Throw error if the article ID is invalid or not found
    }
  }

  // Endpoint to update the status of an article (e.g., Approved, Rejected)
  @Put('article')
  async updateArticleStatus(
    @Body('id') id: string,
    @Body('status') status: 'Approved' | 'Rejected' | 'Shortlisted' | 'Pending',
    @Body('reason') reason: string
  ) {
    let validstatuses = ['Approved', 'Rejected', 'Shortlisted','Pending'];

    if (validstatuses.includes(status)) {
      return await this.articlesService.updateArticleStatus(id, status, reason);
    }
  }

  @Post('report/:id')
  async reportArticle(@Param('id') id: string, @Body('reason') reason: string) {
    
    console.log("reported")
    return await this.articlesService.updateArticleStatus(id, 'Reported', reason);
  }

  // Endpoint to search for articles based on query and optional filters
  @Post('search')  // Using POST for better flexibility with search parameters
  async searchArticles(
    @Body('query') query: string,  // The search query string
    @Body('filters') filters: {    // Optional filters provided in the request body
      SEPractice?: string[];
      Perspective?: number[];
      AfterPubYear?: number;
      BeforePubYear?: number;
    }
  ) {
    return await this.articlesService.searchArticles(query, filters);
  }

  // Endpoint to get all articles that are currently pending review
  @Get('pending')
  async getPendingArticles() {
    return await this.articlesService.getArticles('Pending');
  }

  // Endpoint to retrieve all shortlisted articles
  @Get('shortlisted')
  async getShortlistedArticles() {
    return await this.articlesService.getArticles('Shortlisted');
  }

  @Get('rejected')
  async getRejectedArticles() {
    return await this.articlesService.getArticles('Rejected');
  }

  @Get('reported')
  async getReportedArticles() {
    return await this.articlesService.getArticles('Reported')
  }


  // Endpoint to create multiple new articles in bulk
  @Post('add-all')
  async createArticles(@Body() articles: {
    Authors: string[],
    JournalName: string,
    PubYear: number,
    Volume: string,
    Number: string,
    Pages: string,
    Link: string,
    SEPractice: string,
    Summary: string,
    Perspective: string,
  }[]) {
    return await this.articlesService.createArticles(articles);
  }

  // Endpoint to create a new article
  @Post()
  async createArticle(
    @Body('Authors') Authors: string[],
    @Body('JournalName') JournalName: string,
    @Body('PubYear') PubYear: number,
    @Body('Volume') Volume: string,
    @Body('Number') Number: string,
    @Body('Pages') Pages: string,
    @Body('Link') Link: string,
    @Body('SEPractice') SEPractice: string,
    @Body('Summary') Summary: string,
    @Body('Perspective') Perspective: string,
  ) {
    return await this.articlesService.createArticle({
      JournalName,
      Authors,
      PubYear,
      Volume,
      Number,
      Pages,
      Link,
      SEPractice,
      Summary,
      Perspective
    });
  }
}
