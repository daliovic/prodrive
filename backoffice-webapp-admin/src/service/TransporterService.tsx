import _axios from 'axios';
import mongoose from 'mongoose';

import config from '../configs/config.json';
import { Transporter } from '../interfaces/transporters.interface';

const axios = _axios.create({
  withCredentials: true,
  baseURL: config.SERVER_URL,
});
export class TransporterService {
  async getTransporters() {
    return axios.get("/transporters");
  }
  async updateTransporter(id: string, transporter: Transporter) {
    return axios.put(`/transporters/${id}`, transporter);
  }
  async addTransporter(transporter: Transporter) {
    let id: string = new mongoose.Types.ObjectId().toString();
    transporter["_id"] = id;
    return axios.post("/transporters", transporter);
  }
  async deleteTransporter(id: string) {
    return axios.delete(`/transporters/${id}`);
  }

  // async deleteManyTransporters(transportersIds: string[]) {
  //   axios.delete("/transporters", { data: { transportersIds } });
  // }
}

/* 

axios.delete(URL, {
  headers: {
    Authorization: authorizationToken
  },
  data: {
    source: source
  }
});
*/
