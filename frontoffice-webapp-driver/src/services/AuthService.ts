import _axios from "axios";
import config from "../configs/config.json";
import { User } from "../interfaces/users.interface";
import {Driver} from "../interfaces/drivers.interface";
import {getSavedState} from "../utils/LocalStorage.utils";
import LSVariables from '../configs/LS_variables.json';

const axios = _axios.create({
  withCredentials: true,
  baseURL: config.SERVER_URL,
});
export class AuthService {
  getUser (): Driver {
    return getSavedState(LSVariables.saved_user);
  }
  logIn(user: User) {
    return axios.post(`/loginDriver`, user);
  }
  logOut() {
    return axios.post(`/logout`);
  }
}
