import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import FindIdPage from "./components/FindIdPage";
import FindPasswordPage from "./components/FindPasswordPage";
import axios from "axios"; // Axios 추가


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (loginId) => {
    setIsLoggedIn(true);
    setUsername(loginId); // 로그인한 사용자 이름
  };

  const handleLogout = async () => {
    try {
      // Spring의 /sign-out 엔드포인트에 GET 요청
      const response = await axios.get("http://localhost:80/user/sign-out",{
        credentials: "include", // 세션 쿠키를 포함하여 요청
      });

      if (response.data.code === 200) { 
        // Spring이 설정한 리다이렉트 URL로 이동
        alert("로그아웃 되었습니다.");
         window.location.href = '/home-view'
      } else {
        // 로그아웃 실패 처리
        console.error("로그아웃 실패:", response.statusText);
        setIsLoggedIn(false);
        setUsername("");
      }
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/home-view"
          element={
            <>
             
              <Header
                isLoggedIn={isLoggedIn}
                username={username}
                onLogout={handleLogout}
              />
              <MainPage />
            </>
          }
        />
        //로그인 페이지
        <Route path="/user/sign-in-view" element={<LoginPage onLogin={handleLogin} />} />
       
        <Route path="/user/sign-up-view" element={<SignupPage />} />
        //기본 경로 url
        <Route path="*" element={<Navigate to="/home-view" />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
