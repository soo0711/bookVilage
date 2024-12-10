package com.example.bookVillage.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.bookVillage.message.bo.MessageBO;
import com.example.bookVillage.message.entity.MessageEntity;


@Controller
public class MessageController {

	@Autowired
    private MessageBO messageBO;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	
	 @MessageMapping("/message")
	    public void receiveMessage(MessageEntity messageEntity) {

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
