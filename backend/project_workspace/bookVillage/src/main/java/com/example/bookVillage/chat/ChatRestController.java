package com.example.bookVillage.chat;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.chat.bo.ChatBO;
import com.example.bookVillage.chat.entity.ChatEntity;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat")
public class ChatRestController {

	@Autowired
	private ChatBO chatBO;
	
	@PostMapping("/room")
    public Map<String, Object> chatRoom(
    		@RequestBody Map<String, String> requestBody,
    		HttpSession session) {
		
		Integer userId1 = (Integer) session.getAttribute("userId");
		Integer userId2 = Integer.parseInt(requestBody.get("fromUserId"));
		
		// 채팅방 유무
		Integer chatRoomId = chatBO.getChatRoomByUserId(userId1, userId2);
		
		if (chatRoomId == null) {
			// 채팅방 생성
			chatRoomId = chatBO.addChatRoom(userId1, userId2);
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
	

}


