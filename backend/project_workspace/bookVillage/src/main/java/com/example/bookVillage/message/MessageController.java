package com.example.bookVillage.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.message.bo.MessageBO;
import com.example.bookVillage.message.entity.MessageEntity;

@RestController
public class MessageController {

	@Autowired
    private MessageBO messageBO;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	
	
	
	 @MessageMapping("/message")
	    public void receiveMessage(MessageEntity messageEntity) {
	        // 메시지 저장
	        System.out.println("Received message: " + messageEntity);
	        MessageEntity savedMessage = messageBO.addMessage(
	            messageEntity.getChatroomId(),
	            messageEntity.getUserId(),
	            messageEntity.getMessage()
	        );

	        // 구독 경로로 메시지 전송
	        messagingTemplate.convertAndSend(
	            "/sub/chatroom/" + savedMessage.getChatroomId(),
	            savedMessage
	        );
	    }
}
