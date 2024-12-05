package com.example.bookVillage.admin;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.admin.bo.AdminBO;
import com.example.bookVillage.common.EncryptUtils;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admin")
@RestController
public class AdminRestController {
	
	@Autowired
	private AdminBO adminBO;

	/**
	 * 관리자 - 회원 수정
	 * @param requestBody
	 * @param session
	 * @return
	 * @throws NoSuchAlgorithmException 
	 */
	@PostMapping("/user/update")
	public Map<String, Object> adminUserUpdate (
			@RequestBody Map<String, String> requestBody,
			HttpSession session) throws NoSuchAlgorithmException{
		
		Integer userId = Integer.parseInt(requestBody.get("userId"));
		String userLoginId = (String) session.getAttribute("userLoginId");
		String password = requestBody.get("password");
		String name = requestBody.get("name");
		String email = requestBody.get("email");
		String phoneNumber = requestBody.get("phoneNumber");
		
		Map<String, Object> result = new HashMap<>();
		
		String hashedPassword = password; 
		int count = 0;
		
		if (password != null) { // 비밀번호 변경시
			hashedPassword = EncryptUtils.sha256(password);
			count = adminBO.adminUpdateUserByPassword(userLoginId, hashedPassword, name, email, phoneNumber);
		} else { // 비밀번호 변경 x시
			count = adminBO.adminUpdateUser(userLoginId, name, email, phoneNumber);
		}
	
		
		
		
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "독서모임 수정 성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "수정에 실패했습니다.");
		}
		

	
		return result;
	}
	
	@PostMapping("/book-register/delete")
	public Map<String, Object> bookRegisterDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer userId = (Integer)session.getAttribute("userId");
		Integer bookRegisterId = Integer.parseInt(requestBody.get("bookRegisterId"));

		Integer delete = adminBO.deleteBookRegister(userId, bookRegisterId);
		
		Map<String, Object> result = new HashMap<>();
		if (delete == 1) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "책 삭제 실패");
		}
	
		return result;
	}
	
}
