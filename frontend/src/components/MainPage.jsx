import React from "react";
import Banner from "./Banner";
import High from "./High";
import Notice from "./Notice";

const MainPage = ({ isLoggedIn, username }) => {
  return (
    <div className="main-page">
      <Banner />
      <High />
      <Notice />
    </div>
  );
};

export default MainPage;
