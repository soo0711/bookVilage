package com.example.bookVillage.admin;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.bookRegister.bo.BookRegisterBO;
import com.example.bookVillage.community.bo.CommunityBO;
import com.example.bookVillage.communityComment.bo.CommunityCommentBO;
import com.example.bookVillage.message.bo.MessageBO;
import com.example.bookVillage.user.bo.UserBO;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/admin")
@RestController
public class AdminRestController {

	/**
	 * 관리자 - 회원 수정
	 * @param requestBody
	 * @param session
	 * @return
	 */
	@PostMapping("/user/update")
	public Map<String, Object> adminUserUpdate (
			@RequestBody Map<String, String> requestBody,
			HttpSession session){

		
		Integer userId = Integer.parseInt(requestBody.get("userId"));
		String loginId = requestBody.get("loginId");
		String password = requestBody.get("password");
		String name = requestBody.get("name");
		String email = requestBody.get("email");
		String phoneNumber = requestBody.get("phoneNumber");
		
		Map<String, Object> result = new HashMap<>();
		
		//로그인한 사용자가 관리자일 경우에만 수정 가능
		String userLoginId = (String) session.getAttribute("userLoginId");
		if(userLoginId == "MNG") {
			result.put("code", 500);
			result.put("error_message", "관리자만 수정할 수 있습니다.");
			return result;
		}
		
	
		int count = 0;
		
		//count = userBO.adminUpdateUser(loginId, password, name, email, phoneNumber);
		
		
		
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "독서모임 수정 성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "수정에 실패했습니다.");
		}
		

	
		return result;
	}
	
}
