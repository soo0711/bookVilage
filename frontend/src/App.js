
import React from "react";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Notice from "./components/Notice";
import High from "./components/High";
import LoginPage from "./components/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // return (
  //   <div className="App">
  //     <Header />
  //      <Banner />
  //     <High /> 
  //      <Notice /> 
  //   </div>
  // );
  const handleLogin = (userId) => {
    console.log("Logged in user:", userId);
    // 로그인 처리 로직
  };
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* 홈 페이지 */}
          <Route
            path="/"
            element={
              <>
                <Banner />
                <High />
                <Notice />
              </>
            }
          />
          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
