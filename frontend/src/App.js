import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import FindIdPage from "./components/FindIdPage";
import FindPasswordPage from "./components/FindPasswordPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (loginId) => {
    setIsLoggedIn(true);
    setUsername(loginId); // 로그인한 사용자 이름
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
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
