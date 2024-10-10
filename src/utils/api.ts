// src/utils/api.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// 비인증 Axios 인스턴스
const publicApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증 Axios 인스턴스
const privateApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (비인증)
publicApiClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    return config;
  },
  (error: AxiosError) => {
    alert("요청 오류: " + error.message);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (비인증)
publicApiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    alert("응답 오류: " + (error.response ? error.response.data.message : '네트워크 오류가 발생했습니다.'));
    return Promise.reject(error);
  }
);

// 인증 요청에 사용할 인스턴스의 인터셉터 설정
privateApiClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('authToken'); // 여기서 authToken을 사용하도록 수정
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    alert("요청 오류: " + error.message);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (인증)
privateApiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    alert("응답 오류: " + (error.response ? error.response.data.message : '네트워크 오류가 발생했습니다.'));
    return Promise.reject(error);
  }
);

// 공통 API 요청 함수
const apiRequest = async (client: typeof publicApiClient | typeof privateApiClient, url: string, method: string, body?: any) => {
  return client({
    url,
    method,
    data: body,
  });
};

// API 요청 함수 (비인증)
export const publicApiRequest = (url: string, method: string, body?: any) => {
  return apiRequest(publicApiClient, url, method, body);
};

// API 요청 함수 (인증)
export const privateApiRequest = (url: string, method: string, body?: any) => {
  return apiRequest(privateApiClient, url, method, body);
};
