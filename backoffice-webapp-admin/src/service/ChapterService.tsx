import _axios from "axios";
import mongoose from "mongoose";

import config from "../configs/config.json";
import { Chapter } from "../interfaces/chapters.interface";

const axios = _axios.create({
  withCredentials: true,
  baseURL: config.SERVER_URL,
});
export class ChapterService {
  async getChapters() {
    return axios.get("/chapters");
  }
  async updateChapter(id: string, chapter: Chapter) {
    return axios.put(`/chapters/${id}`, chapter);
  }
  async addChapter(chapter: Chapter) {
    let id: string = new mongoose.Types.ObjectId().toString();
    chapter["_id"] = id;
    return axios.post("/chapters", chapter);
  }
  async deleteChapter(id: string) {
    return axios.delete(`/chapters/${id}`);
  }

  // async deleteManyChapters(chaptersIds: string[]) {
  //   axios.delete("/chapters", { data: { chaptersIds } });
  // }
}
