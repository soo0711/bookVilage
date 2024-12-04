import React from "react";
import "./Header.css";

const Header = ({ isLoggedIn, username, onLogout }) => {
  return (
    <header className="header">
      {/* 인증 섹션 */}
      <div className="auth-section">
        {isLoggedIn ? (
          <>
            <a className="username">{username}님</a>
            <a href="/mypage" className="auth-link">
              마이페이지
            </a>
            <a onClick={onLogout} className="auth-link logout-btn">
              로그아웃
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
        <a href="/book-recommend">책 추천</a>
        <a href="/community">커뮤니티</a>
        <a href="/bookmeeting">독서모임</a>
        <a href="/exchange">지역별 교환</a>
      </nav>
    </header>
  );
};

export default Header;
