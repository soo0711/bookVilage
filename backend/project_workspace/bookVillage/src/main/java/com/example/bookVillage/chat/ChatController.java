/*
package com.example.bookVillage.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.bookVillage.chat.bo.ChatBO;
import com.example.bookVillage.chat.entity.ChatEntity;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
//@RequestMapping("/chat")
public class ChatController {
	
	
	@Autowired
	private ChatBO chatBO;
	
	
	//@MessageMapping("/message")
	//@SendTo("/sub/chatroom/{chatRoomId}")
    public ChatEntity chatMessage(
    		@Payload ChatEntity chat,
    		HttpSession session) {
		log.info("메시지 수신: {}", chat); 
		Integer userId = (Integer) session.getAttribute("userId");
		Integer chatRoomId = chat.getChatRoomId();;
		String message = chat.getMessage();
		
		log.info("chatRoomId: {}, message: {}", chatRoomId, message);
		
        // 메시지 생성
		Integer chatId = chatBO.addChatMessage(chatRoomId, userId, message);
        
		 if (chatId <= 0) {
	            chat.setMessage("메시지 전송 실패");
	        }

	        return chat; // 메시지 객체를 반환하여 클라이언트에 전송
	    }
}
*/