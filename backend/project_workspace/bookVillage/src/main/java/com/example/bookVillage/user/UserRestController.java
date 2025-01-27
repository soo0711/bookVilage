package com.example.bookVillage.user;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.common.EncryptUtils;
import com.example.bookVillage.user.bo.UserBO;
import com.example.bookVillage.user.entity.UserEntity;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/user")
@RestController
public class UserRestController {

	@Autowired
	private UserBO userBO;
	
	// 회원가입 api
	@PostMapping("/sign-up")
	public Map<String, Object> signUp(
			@RequestBody Map<String, String> requestBody) throws NoSuchAlgorithmException {
		
		String loginId = requestBody.get("loginId");
		String password = requestBody.get("password");
		String name = requestBody.get("name");
		String phoneNumber = requestBody.get("phoneNumber");
		String email = requestBody.get("email");
		
		// 해시 비밀번호
		String hashedPassword = EncryptUtils.sha256(password);
		// user db insert
		Integer userId = userBO.addUser(loginId, hashedPassword, name, phoneNumber, email);
		Map<String, Object> result = new HashMap<>();
		if (userId > 0) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "회원가입을 실패했습니다.");
		}
		
		return result;
	}
	
	// 아이디 중복 확인 api		
	@PostMapping("/is-duplicated-id")
	public Map<String, Object> isDuplicatedId(
			@RequestBody Map<String, String> requestBody){
	
		String loginId = requestBody.get("loginId");
		
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
			@RequestBody Map<String, String> requestBody,
			HttpServletRequest request,
			HttpServletResponse response) throws NoSuchAlgorithmException{
		
		String loginId = requestBody.get("loginId");
	    String password = requestBody.get("password");
		
		// db select - id가 있는지
		UserEntity user = userBO.getUserEntityByLoginId(loginId);
		
		Map<String, Object> result = new HashMap<>();
		if (user == null) {
			result.put("code", 500);
			result.put("error_message", "로그인에 실패했습니다.");
			return result;
		}
		
		// db select - id, pw 다 맞는지
		// 해시 비밀번호
		String hashedPassword = EncryptUtils.sha256(password);
		user = userBO.getUserEntityByLoginIdPassword(loginId, hashedPassword);
		
		if (user != null) {
			// 로그인 세션 
			HttpSession session = request.getSession();
			session.setAttribute("userId", user.getId());
			session.setAttribute("userLoginId", user.getLoginId());
			session.setAttribute("userName", user.getName());
		
			 // 세션을 쿠키로 전달 (브라우저가 세션을 기억하게 함)
	        Cookie cookie = new Cookie("JSESSIONID", session.getId());
	        cookie.setHttpOnly(true);
	        cookie.setMaxAge(60 * 60); // 1일 동안 세션 유지
	        cookie.setPath("/");
	        response.addCookie(cookie);
	        
			result.put("code", 200);
			result.put("result", "성공");
			result.put("userName", user.getName());
			result.put("userLoginId", user.getLoginId());
			result.put("userId", user.getId());
		} else {
			result.put("code", 500);
			result.put("error_message", "로그인에 실패했습니다.");
		}
		
		return result;
	}
	
	// 아이디 찾기 api
	@PostMapping("/find-id")
	public Map<String, Object> findId(
			@RequestBody Map<String, String> requestBody){
		
		String name = requestBody.get("name");
		String phoneNumber = requestBody.get("phoneNumber");
		String email = requestBody.get("email");
		
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
	
	// 로그아웃
	@GetMapping("/sign-out")
	public Map<String, Object> signOut(
			HttpSession session) {
		Integer userId = (Integer)session.getAttribute("userId");
		String userLoginId = (String)session.getAttribute("userLoginId");
		
		session.removeAttribute("userId");
		session.removeAttribute("userLoginId");
		session.removeAttribute("userName");
		
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "성공");
		
		return result;
	}
	
	@GetMapping("/api/user-info")
	public ResponseEntity<Map<String, Object>> getUserInfo(HttpServletRequest request) {
	    HttpSession session = request.getSession(false); // 세션 가져오기 (세션이 없으면 null)
	    Map<String, Object> result = new HashMap<>();
	    
	    if (session != null) {
	        Integer userId = (Integer) session.getAttribute("userId");
	        String userLoginId = (String) session.getAttribute("userLoginId");
	        String username = (String) session.getAttribute("username");
	        
	        if (userId != null && userLoginId != null) {
	            result.put("userId", userId);
	            result.put("userLoginId", userLoginId);
	            result.put("username", username);
	            return ResponseEntity.ok(result);
	        }
	    }
	    
	    result.put("error", "로그인되지 않은 사용자");
	    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
	}
	
	@PostMapping("/myPage")
	public Map<String, Object> myPage(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		int userId = (Integer)session.getAttribute("userId");
		
		// db select
		UserEntity user = userBO.getUserEntityById(userId);
		
		Map<String, Object> result = new HashMap<>();
		if (user != null) {
			result.put("userEntity",user);
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "사용자 정보를 찾을 수 없습니다.");
		}
		
		return result;
	}
	
	@PostMapping("/update")
	public Map<String, Object> userUpdate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		int userId = (Integer)session.getAttribute("userId");
		String name = requestBody.get("name");
		String phoneNumber = requestBody.get("phoneNumber");
		String email = requestBody.get("email");
		
		// 중복 확인 및 수정
		Integer user = userBO.updateUser(userId, name, phoneNumber, email);
		
		Map<String, Object> result = new HashMap<>();
		if (user > 0) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "사용자 정보 수정을 할 수 없습니다.");
		}
		
		return result;
	}
}
