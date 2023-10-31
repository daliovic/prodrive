import { Router } from 'express';

import QuestionsController from '@/controllers/questions.controller';
import { CreateQuestionDto } from '@dtos/questions.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { upload } from '@utils/uploader';

class QuestionsRoute implements Routes {
  public path = '/questions';
  public ressource = '/chapters';
  public router = Router();
  public questionsController = new QuestionsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.questionsController.getQuestions);
    this.router.get(`${this.path}/:questionId`, authMiddleware, this.questionsController.getQuestionById);
    this.router.post(
      `${this.path}`,
      upload.array('file'),
      authMiddleware,
      // validationMiddleware(CreateQuestionDto, 'body'),
      this.questionsController.createQuestion,
    );
    this.router.post(`${this.path}/withAnswer`, this.questionsController.getWithAnswers);
    this.router.put(
      `${this.path}/:questionId`,
      upload.array('file'),
      authMiddleware,
      validationMiddleware(CreateQuestionDto, 'body', true),
      this.questionsController.updateQuestion,
    );
    this.router.delete(`${this.path}/:questionId`, authMiddleware, this.questionsController.deleteQuestion);
  }
}

export default QuestionsRoute;
