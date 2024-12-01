import React from "react";
import Header from "./Header";
import Banner from "./Banner";
import Notice from "./Notice";
import High from "./High";
import "./MainPage.css";

const MainPage = ({ isLoggedIn, username, onLogout }) => {
  return (
    <div className="main-page">
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={onLogout} />

      
      <Banner />

      <Notice />

      <High />
    </div>
  );
};

export default MainPage;
