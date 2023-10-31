import { NextFunction, Request, Response } from 'express';

import { CreateChapterDto } from '@dtos/chapters.dto';
import { Chapter } from '@interfaces/chapters.interface';
import { Question } from '@interfaces/questions.interface';
import chapterService from '@services/chapters.service';

class ChaptersController {
  public chapterService = new chapterService();

  public getChapters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllChaptersData: Chapter[] = await this.chapterService.findAllChapter();

      res.status(200).json({ data: findAllChaptersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getChapterById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chapterId: string = req.params.chapterId;
      const findOneChapterData: Chapter = await this.chapterService.findChapterById(chapterId);

      res.status(200).json({ data: findOneChapterData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chapterData: CreateChapterDto = req.body;
      const createChapterData: Chapter = await this.chapterService.createChapter(chapterData);

      res.status(201).json({ data: createChapterData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chapterId: string = req.params.chapterId;
      const chapterData: CreateChapterDto = req.body;
      const updateChapterData: Chapter = await this.chapterService.updateChapter(chapterId, chapterData);

      res.status(200).json({ data: updateChapterData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chapterId: string = req.params.chapterId;
      const deleteChapterData: Chapter = await this.chapterService.deleteChapter(chapterId);

      res.status(200).json({ data: deleteChapterData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public findChapterQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chapterId: string = req.params.chapterId;
      const chapterQuestions: Question[] = await this.chapterService.findChapterQuestions(chapterId);

      res.status(200).json({ data: chapterQuestions, message: 'findChapterQuestions' });
    } catch (error) {
      next(error);
    }
  };

  public findChapterQuestionsByTransporterId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const transporterId: string = req.params.transporterId;
      const transporterChapterQuestion: any = await this.chapterService.findChapterQuestionsByTransporterId(transporterId);
      res.status(200).json({ data: transporterChapterQuestion, message: 'findChapterQuestionsByTransporterId' });
    } catch (error) {
      next(error);
    }
  };

  public resultCalculation = async (req: Request, res: Response) => {
    console.log('---------->', req.body);
    this.chapterService.resultCalculation(req.body.userAnswers).then(result => {
      res.status(200).json({ data: result, message: 'resultCalculation' });
    });
  };
}

export default ChaptersController;
