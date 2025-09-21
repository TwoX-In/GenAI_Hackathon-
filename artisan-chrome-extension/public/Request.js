import axios from "axios";
import { API_URL } from "./config";
function initConfig(isFormData = false) {
  if (!isFormData) {
    axios.defaults.headers.post["Content-Type"] = "application/json";
  } else {
    // For FormData, let the browser set the Content-Type automatically
    delete axios.defaults.headers.post["Content-Type"];
  }
  axios.defaults.baseURL = API_URL;
}

export const Request = {
  get: async (url, params = {}) => {
    initConfig();
    const res = await axios.get(url, { params });
    return res.data;
  },

  postByUrl: async (url, data = {}, isFormData = false) => {
    initConfig(isFormData);
    const res = await axios.post(url, data);
    return res.data;
  },

  deleteByUrl: async (url, params = {}) => {
    initConfig();
    const res = await axios.delete(url, { params });
    return res.data;
  },
};