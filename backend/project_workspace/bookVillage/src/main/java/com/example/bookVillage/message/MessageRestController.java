package com.example.bookVillage.message;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.card.bo.UserMessageBO;
import com.example.bookVillage.card.entity.UserMessageEntity;
import com.example.bookVillage.message.bo.MessageBO;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/chat")
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
	
}
