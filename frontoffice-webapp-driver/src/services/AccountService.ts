import _axios from "axios";
import config from "../configs/config.json";

const axios = _axios.create({
    withCredentials: true,
    baseURL: config.SERVER_URL,
});
export class AccountService {
    SendTransporterEmail(data: {id: string; emailDriver: string}) {
        return axios.post("/sendTransporterEmail", {data});
    }
}
