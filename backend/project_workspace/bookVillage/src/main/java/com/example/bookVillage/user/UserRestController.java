package com.example.bookVillage.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.user.bo.UserBO;
import com.example.bookVillage.user.entity.UserEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RequestMapping("/user")
@RestController
public class UserRestController {

	@Autowired
	private UserBO userBO;
	
	// 회원가입 api
	@PostMapping("/sign-up")
	public Map<String, Object> signUp(
			@RequestParam("loginId") String loginId,
			@RequestParam("password") String password,
			@RequestParam("name") String name,
			@RequestParam("phoneNumber") String phoneNumber,
			@RequestParam("email") String email) {
		
		// 해시 비밀번호
		
		// user db insert
		Integer userId = userBO.addUser(loginId, password, name, phoneNumber, email);
		
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "성공");
		
		return result;
	}
	
	// 아이디 중복 확인 api		
	@PostMapping("/is-duplicated-id")
	public Map<String, Object> isDuplicatedId(
			@RequestParam("loginId") String loginId){
	
		// DB select - Integer로 받기
		UserEntity user = userBO.getUserEntityByLoginId(loginId);
		
		// 응답값
		Map<String, Object> result = new HashMap<>();
		if (user != null) { // 중복
			result.put("code", 200);
			result.put("is_duplicated", true);
		} else { // 중복 아님
			result.put("code", 200);
			result.put("is_duplicated", false);
		}
		
		return result;
	}
	
	// 로그인 api
	@PostMapping("/sign-in")
	public Map<String, Object> signIn(
			@RequestParam("loginId") String loginId,
			@RequestParam("password") String password,
			HttpServletRequest request){
		
		// db select - id가 있는지
		UserEntity user = userBO.getUserEntityByLoginId(loginId);
		
		Map<String, Object> result = new HashMap<>();
		if (user == null) {
			result.put("code", 500);
			result.put("error_message", "로그인에 실패했습니다.");
			return result;
		}
		
		// db select - id, pw 다 맞는지
		user = userBO.getUserEntityByLoginIdPassword(loginId, password);
		
		if (user != null) {
			// 로그인 세션 
			HttpSession session = request.getSession();
			session.setAttribute("userId", user.getId());
			session.setAttribute("userLoginId", user.getLoginId());
			session.setAttribute("userName", user.getName());
			
			result.put("code", 200);
			result.put("result", "성공");
			result.put("userName", user.getName());
			result.put("userLoginId", user.getLoginId());
		} else {
			result.put("code", 500);
			result.put("error_message", "로그인에 실패했습니다.");
		}
		
		return result;
	}
	
	// 아이디 찾기 api
	@PostMapping("/find-id")
	public Map<String, Object> findId(
			@RequestParam("name") String name,
			@RequestParam("phoneNumber") String phoneNumber,
			@RequestParam("email") String email){
		
		// db select
		UserEntity user = userBO.getUserEntityByNamePhoneNumberEmail(name, phoneNumber, email);
		
		Map<String, Object> result = new HashMap<>();
		if (user != null) {
			result.put("userLoginId", user.getLoginId());
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "아이디를 찾을 수 없습니다.");
		}
		
		return result;
	}
	
	// 로그아웃 api
	
	
}