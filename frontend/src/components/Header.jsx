import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="auth-section">
        <a href="/user/sign-up-view">회원가입</a>
        <a href="/user/sign-in-view">로그인</a>
      </div>

      
      <div className="main-header">
        
        <img src="/assets/logo.png" alt="로고" className="logo" />

        <img src="/assets/title.png" alt="동네북 타이틀" className="title" />

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
        <a href="#recommend">책 추천</a>
        <a href="#community">커뮤니티</a>
        <a href="#club">독서모임</a>
        <a href="#region">지역별 교환</a>
      </nav>
    </header>
  );
};

export default Header;
