// src/utils/api.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'js-cookie'; // js-cookie 라이브러리 추가

// API 기본 URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 비인증 Axios 인스턴스
const publicApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증 Axios 인스턴스
const privateApiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 에러 처리 함수
const handleError = (error: AxiosError) => {
  const message = error.response ? error.response.data.message : '네트워크 오류가 발생했습니다.';
  alert("응답 오류: " + message);
  return Promise.reject(error);
};

// 요청 인터셉터 (비인증)
publicApiClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => config,
  (error: AxiosError) => {
    alert("요청 오류: " + error.message);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (비인증)
publicApiClient.interceptors.response.use(
  (response) => response.data,
  handleError
);

// 요청 인터셉터 (인증)
privateApiClient.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = sessionStorage.getItem('accessToken'); // accessToken 사용
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
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config; // 실패한 요청 저장

    // 401 Unauthorized 에러 체크
    if (error.response && error.response.status === 401) {
      await handleRefreshToken(originalRequest);
    }

    return handleError(error);
  }
);

// Refresh Token 처리 함수
const handleRefreshToken = async (originalRequest: AxiosRequestConfig) => {
  const refreshToken = Cookies.get('refreshToken'); // 쿠키에서 리프레시 토큰 가져오기

  if (refreshToken) {
    try {
      // Refresh Token을 사용하여 accessToken을 갱신
      const response = await axios.post(`${API_URL}/users/refresh-token`, { token: refreshToken });
      const { accessToken } = response.data;

      // 새로운 accessToken을 로컬 스토리지에 저장
      sessionStorage.setItem('accessToken', accessToken);

      // 원래 요청에 새로운 accessToken 추가
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // 갱신된 accessToken으로 원래 요청 재전송
      return privateApiClient(originalRequest);
    } catch (refreshError) {
      alert("리프레시 토큰 오류: " + (refreshError.response ? refreshError.response.data.message : '네트워크 오류가 발생했습니다.'));
      handleLogout();
      return Promise.reject(refreshError);
    }
  } else {
    handleLogout(); // refreshToken이 없으면 로그아웃
  }
};

// 로그아웃 처리 함수
const handleLogout = () => {
  // 로컬 스토리지에서 토큰 삭제
  sessionStorage.removeItem('accessToken');
  
  // 쿠키에서 리프레시 토큰 삭제
  Cookies.remove('refreshToken');

  // 로그인 페이지로 리다이렉션
  window.location.href = '/login'; // 적절한 경로로 변경
};

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
