import { Chapter } from '@/interfaces/chapters.interface';
import { Question } from '@/interfaces/questions.interface';
import { CreateChapterDto } from '@dtos/chapters.dto';
import { HttpException } from '@exceptions/HttpException';
import { Transporter } from '@interfaces/transporters.interface';
import chapterModel from '@models/chapters.model';
import transporterModel from '@models/transporters.model';
import QuestionService from '@services/questions.service';
import { isEmpty } from '@utils/util';

class ChapterService {
  public chapters = chapterModel;
  public transporters = transporterModel;

  public async findAllChapter(): Promise<Chapter[]> {
    const chapters: Chapter[] = await this.chapters.find();

    return chapters;
  }

  public async findChapterById(chapterId: string): Promise<Chapter> {
    if (isEmpty(chapterId)) throw new HttpException(400, "You're not chapterId");
    const findChapter: Chapter = await this.chapters.findOne({ _id: chapterId });
    if (!findChapter) throw new HttpException(409, "You're not chapterId");

    return findChapter;
  }

  public async createChapter(chapterData: CreateChapterDto): Promise<Chapter> {
    if (isEmpty(chapterData)) throw new HttpException(400, "You're not chapterData");
    const findChapter: Chapter = await this.chapters.findOne({ title: chapterData.title });
    if (findChapter) throw new HttpException(409, `You're title ${chapterData.title} already exists`);
    const createChapterData: Chapter = await this.chapters.create(chapterData);

    return createChapterData;
  }

  public async updateChapter(chapterId: string, chapterData: CreateChapterDto): Promise<Chapter> {
    if (isEmpty(chapterData)) throw new HttpException(400, "You're not chapterData");

    if (chapterData.title) {
      const findChapter: Chapter = await this.chapters.findOne({ title: chapterData.title });
      if (findChapter && findChapter._id != chapterId) throw new HttpException(409, `You're title ${chapterData.title} already exists`);
    }

    const updateChapterById: Chapter = await this.chapters.findByIdAndUpdate(chapterId, { ...chapterData }, { returnDocument: 'after' });
    if (!updateChapterById) throw new HttpException(409, "You're not chapter");

    return updateChapterById;
  }

  public async deleteChapter(chapterId: string): Promise<Chapter> {
    const deleteChapterById: Chapter = await this.chapters.findByIdAndDelete(chapterId);
    if (!deleteChapterById) throw new HttpException(409, "You're not chapter");

    return deleteChapterById;
  }

  public async findChapterQuestions(chapterId: string): Promise<Question[]> {
    if (isEmpty(chapterId)) throw new HttpException(400, "You're not chapterId");

    const chapters: Chapter[] = await this.chapters.find({ _id: chapterId }, { drivers: 1 }).populate('questions');

    return chapters[0].questions;
  }

  public async findChapterQuestionsByTransporterId(transporterId: string): Promise<Transporter> {
    if (isEmpty(transporterId)) throw new HttpException(400, "You're not transporterId");
    const transporter: Transporter = await this.transporters.findById(transporterId, { password: 0 }).populate({
      path: 'chapters',
      model: 'Chapter',
      populate: {
        path: 'questions',
      },
    });
    console.log(transporter);
    return transporter;
  }

  public resultCalculation(userAnswers: { id: string; answer: string }[]): Promise<number> {
    const questionService = new QuestionService();
    let correctAnswers = 0;
    const requests = [];
    userAnswers.forEach(answer => {
      requests.push(
        new Promise(resolve => {
          questionService.verfiyResponse(answer).then(res => {
            if (res) {
              correctAnswers += 1;
            }
            resolve(correctAnswers);
          });
        }),
      );
    });

    return Promise.all(requests).then(() => {
      return Math.round((correctAnswers / userAnswers.length) * 100);
    });
  }
}

export default ChapterService;
