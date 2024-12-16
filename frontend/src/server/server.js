const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./userRouter");

const app = express();

app.use(bodyParser.json());

// 회원 관련 API 라우트
app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
