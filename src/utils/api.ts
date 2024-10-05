// src/utils/api.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

// 비인증 Axios 인스턴스
const publicApiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // 환경 변수에서 기본 URL 설정
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
    console.error("요청 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (비인증)
publicApiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error("응답 오류:", error);
    if (error.response) {
      throw new Error(error.response.data.message || 'API 요청에 실패했습니다.');
    } else {
      throw new Error('네트워크 오류가 발생했습니다.');
    }
  }
);

// 인증 요청에 사용할 인스턴스의 인터셉터 설정
privateApiClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    // 인증 토큰 추가
    const token = localStorage.getItem('token'); // 혹은 Context API 등을 사용하여 토큰을 가져올 수 있습니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("요청 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (인증)
privateApiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error("응답 오류:", error);
    if (error.response) {
      throw new Error(error.response.data.message || 'API 요청에 실패했습니다.');
    } else {
      throw new Error('네트워크 오류가 발생했습니다.');
    }
  }
);

// API 요청 함수 (비인증)
export const publicApiRequest = async (url: string, method: string, body?: any) => {
  return publicApiClient({
    url,
    method,
    data: body,
  });
};

// API 요청 함수 (인증)
export const privateApiRequest = async (url: string, method: string, body?: any) => {
  return privateApiClient({
    url,
    method,
    data: body,
  });
};
