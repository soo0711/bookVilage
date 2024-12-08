import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import FindIdPage from "./components/FindIdPage";
import FindPasswordPage from "./components/FindPasswordPage";
import BookRecommend from "./components/BookRecommend";
import ChatPage from "./components/ChatPage"; // 채팅 페이지 추가
import ExchangeList from "./components/ExchangeList";
import CommunityPage from "./components/CommunityPage";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import Profile from "./components/Profile";
import BookRegister from "./components/BookRegister";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [client, setClient] = useState(null); // WebSocket 클라이언트
  const [userId, setUserId] = useState(null); // userId 상태 추가

  const handleLogin = (loginId) => {
      setIsLoggedIn(true);
      setUsername(loginId);
    
  };
  const handleBookRegister = (bookData) => {
    // 여기서 책 등록 로직을 처리합니다
    // 백엔드 연동 전까지는 임시로 콘솔에 출력
    console.log('등록된 책 정보:', bookData);
    
    // 나중에 백엔드 연동 시 사용할 코드
    /* try {
      const response = await axios.post('/api/books', bookData);
      if (response.status === 200) {
        console.log('책이 성공적으로 등록되었습니다.');
      }
    } catch (error) {
      console.error('책 등록 중 오류 발생:', error);
    } */
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:80/user/sign-out", {
        withCredentials: true  
      });

      if (response.data.code === 200) {
        alert("로그아웃 되었습니다.");
        window.location.href = '/home-view';
      } else {
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

  // WebSocket 연결 설정
  useEffect(() => {
    const stompClient = Stomp.over(() => new WebSocket("ws://localhost:80/ws"));
    stompClient.connect(
      {},
      () => {
        console.log("WebSocket Connected");
        setClient(stompClient);
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );

    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("WebSocket Disconnected");
        });
      }
    };
  }, []);

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
        <Route 
          path="/book-register/create" 
          element={
            <>
              <Header />
              <BookRegister onRegister={handleBookRegister} username={username} />
            </>
          } 
        />
        <Route path="/user/sign-in-view" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/user/sign-up-view" element={<SignupPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/book-recommend" element={<BookRecommend />} />
        <Route path="/BookMeeting" element={<BookRecommend />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/exchange-list/:bookId" element={<ExchangeList />} />
        <Route 
          path="/profile/:username" 
          element={
            <>
              <Header 
                isLoggedIn={isLoggedIn} 
                username={username} 
                onLogout={handleLogout}
              />
              <Profile />
            </>
          } 
        />

        {<Route
          path="/chat/:targetUsername"
          element={<ChatPage client={client} username={username} isLoggedIn={isLoggedIn} />}
        /> }
        <Route path="*" element={<Navigate to="/home-view" />} />
      </Routes>
    </Router>
  );
}

export default App;
