import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindPage.css";

const FindPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API 호출하여 비밀번호 재설정 링크 전송 로직 구현
    alert("입력하신 이메일로 비밀번호 재설정 링크를 전송했습니다.");
  };

  return (
    <div className="find-container">
      <img src="/assets/logo.png" alt="로고" className="find-logo" />
      <img src="/assets/title.png" alt="타이틀" className="find-title" />
      
      <div className="find-form-container">
        <h2>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="loginId"
              placeholder="아이디"
              value={formData.loginId}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="휴대폰 번호"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="submit-btn">
            비밀번호 재설정 링크 받기
          </button>
        </form>
        
        <div className="links">
          <button onClick={() => navigate("/user/sign-in-view")}>
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;
