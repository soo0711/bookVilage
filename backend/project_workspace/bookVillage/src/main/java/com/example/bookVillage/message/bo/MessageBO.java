package com.example.bookVillage.message.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.message.entity.MessageEntity;
import com.example.bookVillage.message.repository.MessageRepository;

@Service
public class MessageBO {
	@Autowired
	private MessageRepository messageRepository;
	
	public MessageEntity addMessage(int chatroomId, int userId,String message ) {
		
		MessageEntity messageEntity = messageRepository.save(
				MessageEntity.builder()
				.chatroomId(chatroomId)
				.userId(userId)
				.message(message)
				.build()
				);
		
		 return messageEntity != null ? messageEntity : null;
	}
}
