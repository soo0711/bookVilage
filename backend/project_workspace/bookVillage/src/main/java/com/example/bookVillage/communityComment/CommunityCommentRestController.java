package com.example.bookVillage.communityComment;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.community.entity.CommunityEntity;
import com.example.bookVillage.communityComment.bo.CommunityCommentBO;
import com.example.bookVillage.communityComment.entity.CommunityCommentEntity;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:60031")
@RequestMapping("/api/community-comment")
@RestController
public class CommunityCommentRestController {
	@Autowired
	private CommunityCommentBO communityCommentBO;
	
	@PostMapping("/create")
	public Map<String, Object> communityCommentCreate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		int userId = (int) session.getAttribute("userId");
		
		int communityId = Integer.parseInt(requestBody.get("communityId"));
		String content = requestBody.get("content");
		

		// communityComment db insert
		Integer communityCommentId = communityCommentBO.addCommunityComment(communityId, userId , content);
		
		Map<String, Object> result = new HashMap<>();
		if(communityCommentId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "댓글 등록 실패");
		}

	
		return result;
	}
	
	@DeleteMapping("/delete")
	public Map<String, Object> delete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		
		int communityCommentId = Integer.parseInt(requestBody.get("communityCommentId"));
		int userId = (int) session.getAttribute("userId");
		
		CommunityCommentEntity communityCommentEntity = communityCommentBO.getCommunityCommentEntityByCommunityId(communityCommentId);
		
		Map<String, Object> result = new HashMap<>();
		
		int count = 0;
		
		if(communityCommentEntity.getUserId() != userId) {
			result.put("code", 500);
			result.put("error_message", "본인이 작성한 댓글만 삭제할 수 있습니다.");
			
			return result;
		}
		
		count = communityCommentBO.deleteCommunityComment(communityCommentId);
		
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
