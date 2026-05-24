import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

let navigateFunction = null;
let setTokenFunction = null;

export const setupNavigate = (navigate, setToken) => {
  navigateFunction = navigate;
  setTokenFunction = setToken;
};

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.config.url.includes('token/')) {
        return Promise.reject(error); // Login အမှားအတွက်ကတော့ error ဆက်လွှတ်ပေးရပါမယ်
      }

      localStorage.removeItem('token');
      
      if (setTokenFunction) {
        setTokenFunction(null);
      }

      if (navigateFunction) {
        navigateFunction('/login?expired=true');
      }

      // 🌟 [ဒီနေရာက အရေးကြီးဆုံး ပြင်ဆင်မှုပါ]
      // Promise.reject(error) အစား ဒါကို သုံးလိုက်ခြင်းဖြင့် React ဘက်ကို Error မရောက်တော့ဘဲ
      // အခုနက အနီရောင် Uncaught Runtime Errors Screen ကြီး လုံးဝ ပေါ်မလာတော့ပါဘူး။
      return new Promise(() => {}); 
    }
    return Promise.reject(error);
  }
);

export default API;