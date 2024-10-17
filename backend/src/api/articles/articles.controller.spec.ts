import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ObjectId, InsertOneResult } from 'mongodb';


describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: {
            connect: jest.fn(),
            deleteArticleById: jest.fn(),
            getAllApprovedArticles: jest.fn(),
            getArticleById: jest.fn(),
            updateArticleStatus: jest.fn(),
            searchArticles: jest.fn(),
            getPendingArticles: jest.fn(),
            getShortlistedArticles: jest.fn(),
            createArticles: jest.fn(),
            createArticle: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ping', () => {
    it('should connect to MongoDB and return a success message', async () => {
      jest.spyOn(service, 'connect').mockResolvedValueOnce(undefined);
      const result = await controller.ping();
      expect(service.connect).toHaveBeenCalled();
      expect(result).toBe('Pinged your deployment. You successfully connected to MongoDB!');
    });
  });

  describe('deleteArticle', () => {
    it('should delete an article and return a success message', async () => {
      jest.spyOn(service, 'deleteArticleById').mockResolvedValueOnce(true);

      const result = await controller.deleteArticle('507f1f77bcf86cd799439011');
      expect(service.deleteArticleById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual({ message: 'Article deleted successfully' });
    });

    it('should throw NotFoundException if article not found', async () => {
      jest.spyOn(service, 'deleteArticleById').mockResolvedValueOnce(false);

      await expect(controller.deleteArticle('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllApprovedArticles', () => {
    it('should return all approved articles', async () => {
      const articles = [
        { _id: new ObjectId(), title: 'Test Article 1', Status: 'Approved' },
        { _id: new ObjectId(), title: 'Test Article 2', Status: 'Approved' },
      ];
      jest.spyOn(service, 'getAllApprovedArticles').mockResolvedValueOnce(articles);

      const result = await controller.getAllApprovedArticles();
      expect(service.getAllApprovedArticles).toHaveBeenCalled();
      expect(result).toEqual(articles);
    });
  });

  describe('getArticleByID', () => {
    it('should return the article if found', async () => {
      const article = { _id: new ObjectId(), title: 'Test Article', Status: 'Approved' };
      jest.spyOn(service, 'getArticleById').mockResolvedValueOnce(article);

      const result = await controller.getArticleByID('507f1f77bcf86cd799439011');
      expect(service.getArticleById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(article);
    });

    it('should throw BadRequestException if article not found', async () => {
      jest.spyOn(service, 'getArticleById').mockResolvedValueOnce(null);

      await expect(controller.getArticleByID('507f1f77bcf86cd799439011')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateArticleStatus', () => {
    it('should update the article status successfully', async () => {
      jest.spyOn(service, 'updateArticleStatus').mockResolvedValueOnce({ status: 'Success' });

      const result = await controller.updateArticleStatus('507f1f77bcf86cd799439011', 'Approved');
      expect(service.updateArticleStatus).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'Approved');
      expect(result).toEqual({ status: 'Success' });
    });
  });

  describe('searchArticles', () => {
    it('should return search results based on query and filters', async () => {
      const articles = [
        { _id: new ObjectId(), title: 'Test Article', Status: 'Approved' },
      ];
      jest.spyOn(service, 'searchArticles').mockResolvedValueOnce(articles);

      const query = 'test';
      const filters = { SEPractice: ['TDD'], Perspective: [1] };
      const result = await controller.searchArticles(query, filters);
      expect(service.searchArticles).toHaveBeenCalledWith(query, filters);
      expect(result).toEqual(articles);
    });
  });

  describe('getPendingArticles', () => {
    it('should return all pending articles', async () => {
      const articles = [{ _id: new ObjectId(), title: 'Pending Article', Status: 'Pending' }];
      jest.spyOn(service, 'getPendingArticles').mockResolvedValueOnce(articles);

      const result = await controller.getPendingArticles();
      expect(service.getPendingArticles).toHaveBeenCalled();
      expect(result).toEqual(articles);
    });
  });

  describe('getShortlistedArticles', () => {
    it('should return all shortlisted articles', async () => {
      const articles = [{ _id: new ObjectId(), title: 'Shortlisted Article', Status: 'Shortlisted' }];
      jest.spyOn(service, 'getShortlistedArticles').mockResolvedValueOnce(articles);

      const result = await controller.getShortlistedArticles();
      expect(service.getShortlistedArticles).toHaveBeenCalled();
      expect(result).toEqual(articles);
    });
  });

  describe('createArticle', () => {
    it('should create a new article', async () => {
      const article = {
        Authors: ['Author1'],
        JournalName: 'Journal1',
        PubYear: 2021,
        Volume: '10',
        Number: '1',
        Pages: '1-10',
        Link: 'http://example.com',
        SEPractice: 'TDD',
        Summary: 'Summary',
        Perspective: 'Positive',
      };

      const insertOneResultMock: InsertOneResult<Document> = {
        acknowledged: true,
        insertedId: new ObjectId(),
      };

      jest.spyOn(service, 'createArticle').mockResolvedValueOnce({
        status: 'Success',
        message: 'Article created successfully',
        details: insertOneResultMock,
      });

      const result = await controller.createArticle(
        article.Authors,
        article.JournalName,
        article.PubYear,
        article.Volume,
        article.Number,
        article.Pages,
        article.Link,
        article.SEPractice,
        article.Summary,
        article.Perspective,
      );

      expect(service.createArticle).toHaveBeenCalledWith(article);
      expect(result).toEqual({
        status: 'Success',
        message: 'Article created successfully',
        details: insertOneResultMock,
      });
    });
  });
});
