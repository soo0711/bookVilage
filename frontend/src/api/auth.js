import axios from "axios";

const MAIN_API_URL = process.env.REACT_APP_MAIN_API_URL;
const RECOMMEND_API_URL = process.env.REACT_APP_RECOMMEND_API_URL;

// 메인 API와 추천 API를 위한 별도의 axios 인스턴스 생성
const mainApi = axios.create({
  baseURL: MAIN_API_URL
});

const recommendApi = axios.create({
  baseURL: RECOMMEND_API_URL
});

// 회원가입 API 호출 함수
export const registerUser = async (formData) => {
  try {
    const response = await mainApi.post("/api/auth/register", formData); // 회원가입 API 호출
    if (response.data.code === 200) {
      return response.data.result || "회원가입이 성공적으로 완료되었습니다.";
    } else {
      throw new Error(response.data.error_message || "회원가입에 실패했습니다.");
    }
  } catch (error) {
    console.error("회원가입 에러:", error);
    throw new Error(error.response?.data?.error_message || "회원가입 중 문제가 발생했습니다.");
  }
};

// 로그인 API 호출 함수
export const loginUser = async (credentials) => {
  try {
    const response = await mainApi.post("/api/auth/login", credentials); // 로그인 API 호출
    if (response.data.code === 200) {
      return response.data.result || "로그인 성공!";
    } else {
      throw new Error(response.data.error_message || "로그인에 실패했습니다.");
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    throw new Error(error.response?.data?.error_message || "로그인 중 문제가 발생했습니다.");
  }
};

// 로그아웃 API 호출 함수
export const logoutUser = async () => {
  try {
    const response = await mainApi.post("/api/auth/logout"); // 로그아웃 API 호출
    if (response.data.code === 200) {
      return response.data.result || "로그아웃 성공!";
    } else {
      throw new Error(response.data.error_message || "로그아웃에 실패했습니다.");
    }
  } catch (error) {
    console.error("로그아웃 에러:", error);
    throw new Error(error.response?.data?.error_message || "로그아웃 중 문제가 발생했습니다.");
  }
};
