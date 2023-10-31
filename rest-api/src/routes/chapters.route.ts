import { Router } from 'express';

import ChaptersController from '@/controllers/chapters.controller';
import { CreateChapterDto } from '@dtos/chapters.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';

class ChaptersRoute implements Routes {
  public path = '/chapters';
  public ressource = '/questions';
  public router = Router();
  public chaptersController = new ChaptersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.chaptersController.getChapters);
    this.router.get(`${this.path}/:chapterId`, authMiddleware, this.chaptersController.getChapterById);
    this.router.get(`${this.path}${this.ressource}/:chapterId`, authMiddleware, this.chaptersController.findChapterQuestions);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateChapterDto, 'body'), this.chaptersController.createChapter);
    this.router.post(`${this.path}/calculate`, this.chaptersController.resultCalculation);
    this.router.put(
      `${this.path}/:chapterId`,
      authMiddleware,
      validationMiddleware(CreateChapterDto, 'body', true),
      this.chaptersController.updateChapter,
    );
    this.router.delete(`${this.path}/:chapterId`, authMiddleware, this.chaptersController.deleteChapter);
    this.router.get(`${this.path}/transporter/:transporterId/`, this.chaptersController.findChapterQuestionsByTransporterId);
  }
}
export default ChaptersRoute;
