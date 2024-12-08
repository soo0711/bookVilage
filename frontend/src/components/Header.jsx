import React, { useState, useEffect } from "react";
import axios from "axios"; // axios import
import "./Header.css";


const Header = ({ isLoggedIn, username, onLogout }) => {
  const [userId, setUserId] = useState(null);
  const [userLoginId, setUserLoginId] = useState(null);
  //const [username, username] = useState(null);

   // 컴포넌트 마운트 시 API 호출
   useEffect(() => {
    axios.get("http://localhost:80/user/api/user-info",
      { withCredentials: true,}
    )  // 사용자 정보를 가져오는 API 호출
      .then(response => {
        if (response.data.userId && response.data.userLoginId) {
          setUserId(response.data.userId);  // userId 상태 설정
          setUserLoginId(response.data.userLoginId);  // userLoginId 상태 설정
        }
      })
      .catch(error => {
        console.log("로그인된 사용자 정보 불러오기 실패", error);
      });
  }, []);  // 컴포넌트 마운트 시 한 번만 실행되도록 빈 배열 전달


  return (
    <header className="header">
      {/* 인증 섹션 */}
      <div className="auth-section">
        {isLoggedIn ? (
          <>
            <a className="username">{userLoginId}님</a>
            <a href="/mypage" className="auth-link">
              마이페이지
            </a>
            <a onClick={onLogout} className="auth-link logout-btn">
              로그아웃
            </a>
            <a href="/chatRoom" className="auth-link">
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

      {/* 메인 헤더 */}
      <div className="main-header">
        {/* 로고와 타이틀 그룹 */}
        <div className="logo-title-group">
          <img src="/assets/logo.png" alt="로고" className="logo" />
          <img src="/assets/title.png" alt="동네북 타이틀" className="title" />
        </div>

        {/* 검색창 */}
        <div className="search-bar">
          <img src="/assets/menu.png" alt="메뉴 버튼" className="menu-button" />
          <input
            type="text"
            placeholder="Hinted search text"
            className="search-input"
          />
          <button className="search-icon">
            <img src="/assets/search.png" alt="검색 아이콘" />
          </button>
        </div>
      </div>

      <nav className="nav-menu">
        <a href="/book-register/create">책 추천</a>
        <a href="/community">커뮤니티</a>
        <a href="/bookmeeting">독서모임</a>
        <a href="/exchange">지역별 교환</a>
      </nav>
    </header>
  );
};

export default Header;
