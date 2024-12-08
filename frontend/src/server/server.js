const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./userRouter");

const app = express();

// CORS 설정 (localhost:3000에서의 요청을 허용)
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:8000"],  // React와 FastAPI 서버 모두 허용
  methods: ["GET", "POST", "PUT", "DELETE"], // 허용할 HTTP 메서드
  credentials: true // 쿠키 및 인증 헤더를 포함하는 요청을 허용
}));

// 바디 파서 설정
app.use(bodyParser.json());

// 라우트 설정
app.use("/api/users", userRoutes);

app.options('*', cors()); // 모든 경로에 대해 OPTIONS 요청 허용

// 포트 설정
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
