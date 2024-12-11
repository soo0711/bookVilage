package com.example.bookVillage.community;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.community.bo.CommunityBO;
import com.example.bookVillage.community.entity.CommunityEntity;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/community")
@RestController
public class CommunityRestController {
	@Autowired
	private CommunityBO communityBO;
	
	@PostMapping("/create")
	public Map<String, Object> communityCreate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		int userId = (int) session.getAttribute("userId");
		
		String subject = requestBody.get("subject");
		String content = requestBody.get("content");
		

		// community db insert
		Integer communityId = communityBO.addCommunity(userId, subject, content);
		
		Map<String, Object> result = new HashMap<>();
		if(communityId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "커뮤니티 글 등록 실패");
		}

	
		return result;
	}
	
	@PostMapping("/update")
	public Map<String, Object> communityUpdate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		int userId = (int) session.getAttribute("userId");
		
		String subject = requestBody.get("subject");
		String content = requestBody.get("content");
		int communityId = Integer.parseInt(requestBody.get("communityId"));
		

		
		//communityId로 작성자가 로그인한 사람인지 비교
		CommunityEntity communityEntity = communityBO.getCommunityEntityByCommunityId(communityId);
		Map<String, Object> result = new HashMap<>();
	
		int count = 0;
		if(communityEntity.getUserId() != userId) {
			result.put("code", 500);
			result.put("error_message", "본인이 작성한 글만 수정할 수 있습니다.");
			return result;
		}
		
		count = communityBO.updateCommunity(communityId, subject, content);
		
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "커뮤니티 글 수정 성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "수정에 실패했습니다.");
		}
		

	
		return result;
	}
	
	
	@PostMapping("/delete")
	public Map<String, Object> delete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		
		int communityId = Integer.parseInt(requestBody.get("communityId"));
		
		int userId = (int) session.getAttribute("userId");
		CommunityEntity communityEntity = communityBO.getCommunityEntityByCommunityId(communityId);
		
		Map<String, Object> result = new HashMap<>();
		
		int count = 0;
		
		if(communityEntity.getUserId() != userId) {
			result.put("code", 500);
			result.put("error_message", "본인이 작성한 글만 삭제할 수 있습니다.");
			
			return result;
		}
		
		count = communityBO.deleteCommunity(communityId);
		
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "삭제에 실패했습니다.");
		}

		return result;
	}
}
