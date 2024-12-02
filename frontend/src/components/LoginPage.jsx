import React, { useState } from "react";
import "./LoginPage.css";
import axios from "axios"; // Axios 추가

const LoginPage = ({ onLogin }) => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (loginId && password) {
  //     onLogin(loginId); // 부모(App) 컴포넌트로 로그인된 사용자 ID 전달
  //   } else {
  //     alert("아이디와 비밀번호를 입력해주세요.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginId || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      alert(loginId + " " + password);
      // Spring Boot API 호출
      const response = await axios.post("http://localhost:80/user/sign-in", {
        loginId,
        password,
      });

      if (response.result.code === 200) {
        // 로그인 성공 처리
        alert(`환영합니다, ${response.data.userName}님!`);
        onLogin(loginId); // 부모 컴포넌트로 로그인 ID 전달
      } else {
        // 로그인 실패 처리
        alert(response.result.error_message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 요청 중 에러 발생:", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
    }
  };


  return (
    <div className="login-page">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="아이디"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default LoginPage;
