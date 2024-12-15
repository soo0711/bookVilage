import React, { useState } from "react";
import { registerUser } from "../api/auth";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Axios 추가

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
  });

  // 아이디 중복 확인 상태 추가
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isIdAvailable, setIsIdAvailable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 // 아이디 중복 확인 함수
 const handleCheckId = async () => {
  if (!formData.loginId) {
    alert("아이디를 입력해주세요.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:80/user/is-duplicated-id", {
      loginId: formData.loginId
    });

    if (!response.data.is_duplicated) {
      alert("사용 가능한 아이디입니다.");
      setIsIdChecked(true);
      setIsIdAvailable(true);
    } else {
      alert("이미 사용 중인 아이디입니다.");
      setIsIdChecked(true);
      setIsIdAvailable(false);
    }
  } catch (error) {
    console.error("아이디 중복 확인 중 에러 발생:", error);
    alert("아이디 중복 확인에 실패했습니다.");
  }
};

  
const handleClick = () => {
  window.location.href = "/home-view"; // 클릭 시 /home-view로 이동
};

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const message = await registerUser(formData);
  //     alert(message);
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.loginId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (!isIdAvailable) {
      alert("아이디 중복을 확인하세요.");
      return; // 회원가입 진행하지 않음
    }

    if (!formData.password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (!formData.name) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!formData.phoneNumber) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    try {
      // Spring Boot API 호출
      const loginId = formData.loginId;
      const password = formData.password;
      const name = formData.name;
      const email = formData.email;
      const phoneNumber = formData.phoneNumber;
      const response = await axios.post("http://localhost:80/user/sign-up", {
        loginId,
        password,
        name,
        email,
        phoneNumber,
      });

      if (response.data.code === 200) {
        // 회원가입 성공 처리
        alert("회원가입 되었습니다.")
        navigate("/user/sign-in-view");
      } else {
        // 로그인 실패 처리
        alert(response.data.error_message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생:", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <div onClick={handleClick}>
        <img src="/assets/logo.png" alt="로고" className="logo" />
        <img src="/assets/title.png" alt="타이틀" className="title" />
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group">
          <div className="id-input-wrapper">
            <input 
              name="loginId" 
              placeholder="아이디" 
              onChange={handleChange} 
              className="input-field"
            />
            <button 
              type="button" 
              onClick={handleCheckId}
              className="check-id-button"
            >
              중복확인
            </button>
          </div>

          <div className="input-wrapper">
            <input 
              type="password" 
              name="password" 
              placeholder="비밀번호" 
              onChange={handleChange} 
              className="input-field"
            />
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