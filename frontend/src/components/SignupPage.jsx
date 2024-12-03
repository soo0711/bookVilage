import React, { useState } from "react";
import { registerUser } from "../api/auth";
import "./SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const message = await registerUser(formData);
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-container">
       <img src="/assets/logo.png" alt="로고" className="logo" />
       <img src="/assets/title.png" alt="타이틀" className="title" />
      
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group">
          <div className="input-wrapper">
            <i className="icon user-icon">👤</i>
            <input 
              name="loginId" 
              placeholder="아이디" 
              onChange={handleChange} 
              className="input-field"
            />
            
          </div>

          <div className="input-wrapper">
            <i className="icon lock-icon">🔒</i>
            <input 
              type="password" 
              name="password" 
              placeholder="비밀번호" 
              onChange={handleChange} 
              className="input-field"
            />
            <button type="button" className="toggle-visibility">👁️</button>
          </div>

          <div className="input-wrapper">
            <input 
              name="name" 
              placeholder="이름" 
              onChange={handleChange} 
              className="input-field"
            />
          </div>

          <div className="input-wrapper">
            <input 
              name="email" 
              placeholder="이메일" 
              onChange={handleChange} 
              className="input-field"
            />
          </div>

          <div className="input-wrapper">
            <input 
              name="phoneNumber" 
              placeholder="휴대폰 번호" 
              onChange={handleChange} 
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignupPage;