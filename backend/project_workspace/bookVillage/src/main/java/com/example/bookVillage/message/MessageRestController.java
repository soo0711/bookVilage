package com.example.bookVillage.message;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.card.bo.UserMessageBO;
import com.example.bookVillage.card.entity.UserMessageEntity;
import com.example.bookVillage.message.bo.MessageBO;
import com.example.bookVillage.message.entity.ChatRoomEntity;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:60031", "http://ceprj.gachon.ac.kr:60031"}, allowCredentials = "true")
public class MessageRestController {

	@Autowired
    private MessageBO messageBO;
	
	
	
	@Autowired
	private UserMessageBO userMessageBO;
	
	@PostMapping("/room")
    public Map<String, Object> chatRoom(
    		@RequestBody Map<String, String> requestBody,
    		HttpSession session) {
		
		Integer userId1 = (Integer) session.getAttribute("userId");
		Integer userId2 = Integer.parseInt(requestBody.get("fromUserId"));
		
		// 채팅방 유무
		Integer chatRoomId = messageBO.getChatRoomByUserId(userId1, userId2);
		
		if (chatRoomId == null) {
			// 채팅방 생성
			chatRoomId = messageBO.addChatRoom(userId1, userId2);
		}
        
		Map<String, Object> result = new HashMap<>();
		if (chatRoomId > 0) {
			result.put("code", 200);
			result.put("result", "성공");
			result.put("chatRoomId", chatRoomId); // roomId 넘겨주기
		} else {
			result.put("code", 500);
			result.put("error_message", "채팅방 생성을 실패했습니다.");
		}
		
		return result;
    }
	
	
	@PostMapping("/record-list")
	public Map<String, Object> recordList(
    		@RequestBody Map<String, String> requestBody,
    		HttpSession session) {
		
		int chatRoomId = Integer.parseInt(requestBody.get("chatroomId"));
		
		UserMessageEntity userMessage = userMessageBO.getUserMessageEntityByChatRoomId(chatRoomId);
		
        
		Map<String, Object> result = new HashMap<>();
		if (chatRoomId > 0) {
			result.put("code", 200);
			result.put("result", "성공");
			result.put("userMessage", userMessage); // roomId 넘겨주기
		} else {
			result.put("code", 500);
			result.put("error_message", "채팅방 기록 불러오기에  실패했습니다.");
		}
		
		return result;
    }
	
	
	@PostMapping("/list")
	public Map<String, Object> chatList(
    		HttpSession session) {
		
		int userId = (Integer) session.getAttribute("userId");
		List<UserMessageEntity> userMessageList = new ArrayList<>();
		
		List<ChatRoomEntity> chatRoomList = messageBO.getChayRommListByUserId(userId);
		for(int i = 0; i < chatRoomList.size(); i++) {
			userMessageList.add(userMessageBO.getUserMessageEntityByChatRoomId(chatRoomList.get(i).getId()));
		}
        
		Map<String, Object> result = new HashMap<>();
		if (chatRoomList != null && !chatRoomList.isEmpty()) {
	        // 채팅방이 존재하는 경우
	        result.put("code", 200);
	        result.put("result", "성공");
	        result.put("chatRoomList", chatRoomList);  // 채팅방 목록을 전달
	        result.put("userMessageList", userMessageList);  // 채팅방 내용 전달
	        result.put("myId", userId);  
	    } else {
	        // 채팅방이 없는 경우
	        result.put("code", 204); // No Content
	        result.put("result", "진행 중인 채팅이 없습니다.");
	    }
		return result;
    }
	
}
