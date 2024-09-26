import { Controller, Get, Param, Post, Put, Body, Query, BadRequestException } from '@nestjs/common';
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
    @Body('status') status: 'Approved' | 'Rejected'
  ) {
    
    return await this.articlesService.updateArticleStatus(id, status);
  }

  // Search for articles by query
  @Get('search')
  async searchArticles(@Query('query') query: string) {
    if (!query) {
      throw new BadRequestException("No Query Provided");
    }
    return await this.articlesService.searchArticles(query);
  }

  // Get all pending articles
  @Get('pending')
  async getPendingArticles() {
    return await this.articlesService.getPendingArticles();
  }

  // Create a new article
  @Post()
  async createArticle(
    @Body('Title') Title: string,
    @Body('Authors') Authors: string[],
    @Body('Source') Source: string,
    @Body('PubYear') PubYear: string,
    @Body('SEPractice') SEPractice: string,
    @Body('Perspective') Perspective: string,
  ) {
    return await this.articlesService.createArticle({
      Title,
      Authors,
      Source,
      PubYear,
      SEPractice,
      Perspective
    });
  }
}
