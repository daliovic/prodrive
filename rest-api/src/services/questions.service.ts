import { Question } from '@/interfaces/questions.interface';
import chapterModel from '@/models/chapters.model';
import { CreateQuestionDto } from '@dtos/questions.dto';
import { HttpException } from '@exceptions/HttpException';
import questionModel from '@models/questions.model';
import { isEmpty } from '@utils/util';
class QuestionService {
  public questions = questionModel;
  public chapters = chapterModel;

  public async findAllQuestion(): Promise<Question[]> {
    const questions: Question[] = await this.questions.find();

    return questions;
  }

  public async findQuestionById(questionId: string): Promise<Question> {
    if (isEmpty(questionId)) throw new HttpException(400, "You're not questionId");
    const findQuestion: Question = await this.questions.findOne({ _id: questionId });
    if (!findQuestion) throw new HttpException(409, "You're not questionId");

    return findQuestion;
  }

  public async createQuestion(questionData: CreateQuestionDto): Promise<Question> {
    if (isEmpty(questionData)) throw new HttpException(400, "You're not questionData");
    const findQuestion: Question = await this.questions.findOne({ questionAnnouncement: questionData.questionAnnouncement });
    if (findQuestion) throw new HttpException(409, `You're title ${questionData.questionAnnouncement} already exists`);
    const createQuestionData: Question = await this.questions.create(questionData);

    const chapterId = questionData.chapter;
    await this.chapters.findByIdAndUpdate(chapterId, { $push: { questions: questionData._id } }, { new: true, useFindAndModify: false });

    return createQuestionData;
  }

  public async updateQuestion(questionId: string, questionData: CreateQuestionDto): Promise<Question> {
    if (isEmpty(questionData)) throw new HttpException(400, "You're not questionData");

    const findQuestion: Question = await this.questions.findOne({ questionAnnouncement: questionData.questionAnnouncement });
    if (findQuestion && findQuestion._id != questionId)
      throw new HttpException(409, `You're title ${questionData.questionAnnouncement} already exists`);

    const updateQuestionById: Question = await this.questions.findByIdAndUpdate(questionId, { ...questionData }, { returnDocument: 'after' });
    if (!updateQuestionById) throw new HttpException(409, "You're not chapter");

    await this.chapters.findByIdAndUpdate(findQuestion.chapter, { $pull: { questions: questionId } }, { new: true, useFindAndModify: false });
    await this.chapters.findByIdAndUpdate(questionData.chapter, { $push: { questions: questionId } }, { new: true, useFindAndModify: false });

    return updateQuestionById;
  }

  public async deleteQuestion(questionId: string): Promise<Question> {
    const deleteQuestionById: Question = await this.questions.findByIdAndDelete(questionId);
    if (!deleteQuestionById) throw new HttpException(409, "You're not chapter");
    await this.chapters.findByIdAndUpdate(deleteQuestionById.chapter, { $pull: { questions: questionId } }, { new: true, useFindAndModify: false });

    return deleteQuestionById;
  }

  public async verfiyResponse(answerData: { id: string; answer: string }): Promise<Boolean> {
    if (isEmpty(answerData.id)) throw new HttpException(400, "You're not questionId");
    const findQuestion: Question = await this.questions.findOne({ _id: answerData.id });
    if (!findQuestion) throw new HttpException(409, "You're not questionId");
    console.log('******************', findQuestion);
    console.log('******************', answerData.answer);
    if (findQuestion.correctAnswers.includes(answerData.answer)) {
      return true;

      // if (findQuestion.correctAnswer === answerData.answer) {
      //   return true;
    } else {
      return false;
    }
  }

  public async getWithAnswers(questionsIds: string[]): Promise<Question[]> {
    const questions: Question[] = [];
    for (const questionId of questionsIds) {
      const findQuestion: Question = await this.questions.findOne({ _id: questionId });
      if (!findQuestion) throw new HttpException(409, "You're not questionId");
      questions.push(findQuestion);
    }
    return questions;
  }
}

export default QuestionService;
