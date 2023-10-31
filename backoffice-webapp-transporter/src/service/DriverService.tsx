import _axios from 'axios';
import mongoose from 'mongoose';

import config from '../configs/config.json';
import {  Driver } from '../interfaces/drivers.interface';

const axios = _axios.create({
  withCredentials: true,
  baseURL: config.SERVER_URL,
});
export class DriverService {
  async getDrivers() {
    return axios.get("/drivers");
  }
  async updateDriver(id: string, driver: Driver) {
    return axios.put(`/drivers/${id}`, driver);
  }
  async addDriver(driver: Driver) {
    let id: string = new mongoose.Types.ObjectId().toString();
    driver["_id"] = id;
    return axios.post("/drivers", driver);
  }
  async deleteDriver(id: string) {
    return axios.delete(`/drivers/${id}`);
  }

  // async deleteManyDrivers(driversIds: string[]) {
  //   axios.delete("/drivers", { data: { driversIds } });
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
