import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import FindIdPage from "./components/FindIdPage";
import FindPasswordPage from "./components/FindPasswordPage";
import BookRecommend from "./components/BookRecommend";
import BookMeeting from "./components/BookMeeting";
import ChatPage from "./components/chatPage"; // 채팅 페이지 추가
import ExchangeList from "./components/ExchangeList";
import CommunityPage from "./components/CommunityPage";
import BookMeeting from "./components/BookMeeting";
import axios from "axios";
import { Stomp } from "@stomp/stompjs";
import Profile from "./components/Profile";
import BookRegister from "./components/BookRegister";
<<<<<<< HEAD
=======
import BookRecommendation from "./components/BookRecommendation";
import ChatList from './components/ChatList';
import BookDetail from "./components/BookDetail";
import MyPage from "./components/MyPage";
import SearchResults from './components/SearchResults';
import BookUpdate from './components/BookUpdate';
import TasteDetails from './components/TasteDetails';
import ModifyMeeting from './components/ModifyMeeting';
import RegionalExchange from "./components/RegionalExchange";
>>>>>>> suhyun-back

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [client, setClient] = useState(null); // WebSocket 클라이언트
<<<<<<< HEAD

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
=======
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;  
  });

  const handleLogin = (loginId, userId) => {  // userId도 받아오도록 수정
    setIsLoggedIn(true);
    setUsername(loginId);
    setUserId(userId);  // userId 설정
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', loginId);
    localStorage.setItem('userId', userId);  
>>>>>>> suhyun-back
  };


  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:80/user/sign-out", {
        credentials: "include",
      });

      if (response.data.code === 200) {
        alert("로그아웃 되었습니다.");
        window.location.href = '/home-view';
      } else {
        console.error("로그아웃 실패:", response.statusText);
        setIsLoggedIn(false);
        setUsername("");
        setUserId(null); // 로그아웃 시 userId 초기화
      }
    } catch (error) {
      console.error("로그아웃 요청 중 오류 발생:", error);
      setIsLoggedIn(false);
      setUsername("");
      setUserId(null); // 로그아웃 시 userId 초기화
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
                userId={userId} // 전달 추가
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
<<<<<<< HEAD
        <Route path="/book-recommend" element={<BookRecommend />} />
        <Route path="/BookMeeting" element={<BookMeeting />} />
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
=======
        <Route path="/book-recommend" element={<BookRecommend username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/BookMeeting" element={<BookMeeting username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/community" element={<CommunityPage username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/exchange-list/:bookId" element={<ExchangeList username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/book-register" element={<BookRegister username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/recommendation" element={<BookRecommendation username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/chatlist" element={<ChatList username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>}  />
        <Route path="/book/:isbn"  element={<BookDetail isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout}/>} />
        <Route path="/myPage" element={<MyPage  userId={userId} username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/book/update" element={<BookUpdate  userId={userId} username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/search" element={<SearchResults username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/taste" element={<TasteDetails username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/modify-meeting/:meetingId" element={<ModifyMeeting username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route path="/profile/:userId" element={<Profile  username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
        <Route
          path="/chat/:chatRoomId"
          element={<ChatPage client={client}  username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>} />
>>>>>>> suhyun-back
        <Route path="*" element={<Navigate to="/home-view" />} />
        <Route path="/exchange" element={<RegionalExchange username={username} isLoggedIn={isLoggedIn} handleLogout={handleLogout}/>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;
