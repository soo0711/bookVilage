const express = require("express");
const router = express.Router();
const userController = require("./userController");

// 회원가입
router.post("/user/sign-up-view", userController.registerUser);

// 로그인
router.post("/user/sign-in-view", userController.loginUser);

module.exports = router;
