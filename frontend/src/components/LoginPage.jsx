import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios"; // Axios 추가

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 임시 로그인 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.loginId && formData.password) {
      // 임시로 무조건 로그인 성공 처리
      alert(`환영합니다, ${formData.loginId}님!`);
      onLogin(formData.loginId);
      navigate("/home-view");
    } else {
      alert("아이디와 비밀번호를 입력해주세요.");
    }
  };

  const handleFindId = () => {
    // ID 찾기 페이지로 이동 또는 모달 표시
    window.location.href = '/find-id';
  };

  const handleFindPassword = () => {
    // 비밀번호 찾기 페이지로 이동 또는 모달 표시
    window.location.href = '/find-password';
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        {/* 로고와 타이틀 */}
        <img src="/assets/logo.png" alt="로고" className="logo" />
        <img src="/assets/title.png" alt="타이틀" className="title" />
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="loginId"
            placeholder="User ID"
            value={formData.loginId}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="User Password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <div className="help-links">
            <button 
              type="button" 
              onClick={handleFindId} 
              className="find-link"
            >
              아이디 찾기
            </button>
            <span className="divider">|</span>
            <button 
              type="button" 
              onClick={handleFindPassword} 
              className="find-link"
            >
              비밀번호 찾기
            </button>
          </div>

          <button type="submit" className="sign-in-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;