import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Header.css";

const Header = ({ isLoggedIn: propIsLoggedIn, username, onLogout, setBooks}) => {
  const navigate = useNavigate();  // useNavigate 훅 사용
  const [userId, setUserId] = useState(null);
  const [userLoginId, setUserLoginId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 검색어를 URL 쿼리로 전달
      navigate(`/search?title=${searchQuery}`);
    }
  };

  const handleClick = () => {
    window.location.href = "/home-view"; // 클릭 시 /home-view로 이동
  };
  
  useEffect(() => {
    setIsLoggedIn(propIsLoggedIn);
  }, [propIsLoggedIn]);

  useEffect(() => {
    axios.get("http://ceprj.gachon.ac.kr:60031/api/user/api/user-info", {
      withCredentials: true,
    })
    .then(response => {
      if (response.data.userId && response.data.userLoginId) {
        setUserId(response.data.userId);
        setUserLoginId(response.data.userLoginId);
        setIsLoggedIn(true); // API 응답이 성공하면 로그인 상태를 true로 설정
      }
    })
    .catch(error => {
      console.log("로그인된 사용자 정보 불러오기 실패", error);
      setIsLoggedIn(false); // API 호출이 실패하면 로그인 상태를 false로 설정
    });
  }, [setUserId]);

  return (
    <header className="header">
      <div className="auth-section">
        {isLoggedIn ? (
          <>
            <a className="username">{userLoginId}님</a>
            <a href="/myPage" className="auth-link">
              마이페이지
            </a>
            <a href="#" onClick={onLogout} className="auth-link">
              로그아웃
            </a>
            <a href="/chatlist/" className="auth-link">
              채팅방
            </a>
          </>
        ) : (
          <>
            <a href="/user/sign-up-view">회원가입</a>
            <a href="/user/sign-in-view">로그인</a>
          </>
        )}
      </div>

      <div className="main-header">
        <div className="logo-title-group" onClick={handleClick}>
          <img src="/assets/logo.png" alt="로고" className="logo" />
          <img src="/assets/title.png" alt="동네북 타이틀" className="title" />
        </div>

        <div className="search-bar">
          <button type="button" className="menu-button">
            <img src="/assets/menu.png" alt="메뉴 버튼" />
          </button>
          <input
            type="text"
            placeholder="Hinted search text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-icon" onClick={handleSearch}>
            <img src="/assets/search.png" alt="검색 아이콘" />
          </button>

        </div>
      </div>

      <nav className="nav-menu">
        <a href="/book-recommend">책 추천</a>
        <a href="/bookmeeting">독서모임</a>
        <a href="/exchange">지역별 교환</a>
      </nav>
    </header>
  );
};

export default Header;