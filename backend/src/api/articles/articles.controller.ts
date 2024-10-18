import { Controller, Get, Param, Post, Put, Body, Query, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { ArticlesService } from './articles.service';



@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Ping the MongoDB server to ensure connection
  @Get('ping')
  async ping() {
    await this.articlesService.connect();
    return 'Pinged your deployment. You successfully connected to MongoDB!';
  }

  @Delete()
  async deleteArticle(@Query('id') id: string) {
    const result = await this.articlesService.deleteArticleById(id);
    if (!result) {
      throw new NotFoundException('Article not found');
    }
    return { message: 'Article deleted successfully' };
  }

  // Get all approved articles
  @Get()
  async getAllApprovedArticles() {
    return await this.articlesService.getAllApprovedArticles();
  }

  // Get article by ID
  @Get('article')
  async getArticleByID(@Query('id') id: string) {
    const article = await this.articlesService.getArticleById(id);
    if (article) {
      return article;
    } else {
      throw new BadRequestException();
    }
  }

  // Update article status (approve or reject)
  @Put('article')
  async updateArticleStatus(
    @Body('id') id: string,
    @Body('status') status: 'Approved' | 'Rejected' | 'Shortlisted' | 'Pending' | 'Reported',
  ) {
    let validstatuses = ['Approved', 'Rejected', 'Shortlisted','Pending', 'Reported'];

    if (validstatuses.includes(status))
    {
      return await this.articlesService.updateArticleStatus(id, status);
    }
    
  }

  @Post('report/:id')
  async reportArticle(@Param('id') id: string) {
    return await this.articlesService.updateArticleStatus(id, 'Reported');
  }

  @Post('search')  // Changed to POST
  async searchArticles(
    @Body('query') query: string,  // Query string for search
    @Body('filters') filters: {    // Optional filters in the request body
      SEPractice?: string[];
      Perspective?: number[];
      AfterPubYear?: number;
      BeforePubYear?: number;
    }
  ) {
    return await this.articlesService.searchArticles(query, filters);
  }

  // Get all pending articles
  @Get('pending')
  async getPendingArticles() {
    return await this.articlesService.getPendingArticles();
  }

  @Get('shortlisted')
  async getShortlistedArticles() {
    return await this.articlesService.getShortlistedArticles();
  }

  // Create multiple new articles
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

  // Create a new article
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
