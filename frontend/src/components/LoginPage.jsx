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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // 로그인 처리 로직 (API 호출)
  //   if (formData.loginId && formData.password) {
  //     onLogin(formData.loginId);
  //     navigate("/home-view");
  //   } else {
  //     alert("아이디와 비밀번호를 입력해주세요.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.loginId || !formData.password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      // Spring Boot API 호출
      const loginId = formData.loginId;
      const password = formData.password;
      const response = await axios.post("http://localhost:80/user/sign-in", {
        loginId,
        password,
      },{
        withCredentials: true,
      });

      if (response.data.code === 200) {
        // 로그인 성공 처리
        alert(`환영합니다, ${response.data.userName}님!`);
        onLogin(formData.loginId); // 부모 컴포넌트로 로그인 ID 전달
        navigate("/home-view");
      } else {
        // 로그인 실패 처리
        alert(response.data.error_message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생:", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
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