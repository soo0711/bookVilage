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
		String name = requestBody.get("name");
		String email = requestBody.get("email");
		String phoneNumber = requestBody.get("phoneNumber");
		
		Map<String, Object> result = new HashMap<>();
		
		
		int count = 0;
		count = adminBO.adminUpdateUser(userId, name, email, phoneNumber);
		
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "독서모임 수정 성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "수정에 실패했습니다.");
		}
		

	
		return result;
	}
	
	/**
	 * 관리자 - 책 등록 삭제 
	 * @param requestBody
	 * @param session
	 * @return
	 */
	@PostMapping("/book-register/delete")
	public Map<String, Object> adminBookRegisterDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer bookRegisterId = Integer.parseInt(requestBody.get("bookRegisterId"));

		Integer delete = adminBO.deleteBookRegisterById(bookRegisterId);
		
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
	
	/**
	 * 관리자 - 커뮤니티 수정
	 * @param requestBody
	 * @param session
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	@PostMapping("/community/update")
	public Map<String, Object> adminCommunityUpdate (
			@RequestBody Map<String, String> requestBody,
			HttpSession session) throws NoSuchAlgorithmException{
		
		Integer communityId = Integer.parseInt(requestBody.get("communityId"));
		String subject = requestBody.get("subject");
		String content = requestBody.get("content");
		
		Map<String, Object> result = new HashMap<>();
		
		int count = 0;
		count = adminBO.adminUpdateCommunity(communityId, subject, content);
		
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "커뮤니티 수정 성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "수정에 실패했습니다.");
		}
		
		return result;
	}
	
	/**
	 * 커뮤니티 삭제
	 * @param requestBody
	 * @param session
	 * @return
	 */
	@PostMapping("/community/delete")
	public Map<String, Object> adminCommunityDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer communityId = Integer.parseInt(requestBody.get("communityId"));

		Integer count = adminBO.adminDeleteCommunity(communityId);
		
		Map<String, Object> result = new HashMap<>();
		if (count == 1) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "커뮤니티 삭제 실패");
		}
	
		return result;
	}
	
	/**
	 * 관리자 - 커뮤니티 댓글 삭제
	 * @param requestBody
	 * @param session
	 * @return
	 */
	@PostMapping("/community-comment/delete")
	public Map<String, Object> adminCommunityCommentDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer communityCommentId = Integer.parseInt(requestBody.get("communityCommentId"));

		Integer count = adminBO.adminDeleteCommunityComment(communityCommentId);
		
		Map<String, Object> result = new HashMap<>();
		if (count == 1) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "커뮤니티 댓글 삭제 실패");
		}
	
		return result;
	}
	
	/**
	 * 관리자 - 독서모임 삭제
	 * @param requestBody
	 * @param session
	 * @return
	 */
	@PostMapping("/book-meeting/delete")
	public Map<String, Object> adminBookMeetingDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));

		Integer count = adminBO.adminDeletebookMeeting(bookMeetingId);
		
		Map<String, Object> result = new HashMap<>();
		if (count == 1) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "독서 모임 삭제 실패");
		}
	
		return result;
	}
	
	
	@PostMapping("/personal-schedule/delete")
	public Map<String, Object> adminMessageDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer personalScheduleId = Integer.parseInt(requestBody.get("personalScheduleId"));

		Integer count = adminBO.adminDeletePersonalSchedule(personalScheduleId);
		
		Map<String, Object> result = new HashMap<>();
		if (count == 1) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "독서 모임 삭제 실패");
		}
	
		return result;
	}
}
