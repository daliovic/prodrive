import _axios from "axios";
import config from "../configs/config.json";

const axios = _axios.create({
    withCredentials: true,
    baseURL: config.SERVER_URL,
});
export class QuestionService {
    async getQuestions() {
        return axios.get("/questions");
    }
    async getWithAnswer(questionsIds: string[]) {
        return axios.post(`/questions/withAnswer`, {questionsIds});
    }
}
