import axios from "axios";
import { API_URL } from "@/config/config";

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

  postByUrl: async (url, data = {}, isFormData=false) => {
    initConfig(isFormData);
    console.log("=== REQUEST DEBUG ===");
    console.log("Making POST request to:", url);
    console.log("Request data type:", isFormData ? "FormData" : "JSON");
    console.log("Request data type:", data instanceof FormData ? "FormData" : typeof data);
    console.log("Request data size:", data instanceof FormData ? "FormData entries" : JSON.stringify(data).length + " chars");
    console.log("Base URL:", axios.defaults.baseURL);
    console.log("Full URL:", `${axios.defaults.baseURL}${url}`);
    
    try {
      const res = await axios.post(url, data);
      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);
      console.log("Response data type:", typeof res.data);
      console.log("Response data keys:", Object.keys(res.data || {}));
      console.log("Response data size:", JSON.stringify(res.data).length + " chars");
      console.log("=== END REQUEST DEBUG ===");
      return res.data;
    } catch (error) {
      console.error("=== REQUEST ERROR DEBUG ===");
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.message);
      console.error("=== END REQUEST ERROR DEBUG ===");
      throw error;
    }
  },

  deleteByUrl: async (url, params = {}) => {
    initConfig();
    const res = await axios.delete(url, { params });
    return res.data;
  },
};