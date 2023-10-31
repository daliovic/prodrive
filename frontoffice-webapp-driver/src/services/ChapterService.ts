import _axios from "axios";
import config from "../configs/config.json";

const axios = _axios.create({
    withCredentials: true,
    baseURL: config.SERVER_URL,
});
export class ChapterService {
    async getChaptersDetails(transporterId: string) {
        return axios.get(`/chapters/transporter/${transporterId}`);
    }

    async calculate(userAnswers: {id: string, answer: string}[]) {
        return axios.post(`/chapters/calculate`, {userAnswers});
    }
}