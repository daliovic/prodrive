import _axios from "axios";
import { Question } from "../interfaces/questions.interface";
import mongoose from "mongoose";

import config from "../configs/config.json";
const axios = _axios.create({
  withCredentials: true,
  baseURL: config.SERVER_URL,
});
export class QuestionService {
  async getQuestions() {
    return axios.get("/questions");
  }
  async updateQuestion(id: string, question: Question) {
    return axios.put(`/questions/${id}`, question);
  }
  async addQuestion(question: FormData) {
    let id: string = new mongoose.Types.ObjectId().toString();
    question.append("_id", id);
    return axios.post("/questions", question, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  async deleteQuestion(id: string) {
    return axios.delete(`/questions/${id}`);
  }

  // async deleteManyQuestions(questionsIds: string[]) {
  //   axios.delete("/questions", { data: { questionsIds } });
  // }
}
