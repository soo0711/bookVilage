package com.example.bookVillage.message.bo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.message.entity.MessageEntity;
import com.example.bookVillage.message.repository.MessageRepository;

@Service
public class MessageBO {
	@Autowired
	private MessageRepository messageRepository;
	
	@Autowired
	private ChatRoomBO chatRoomBO;
	
	public Integer addChatRoom(int userId1, int userId2) {
		return chatRoomBO.addChatRoom(userId1, userId2);
	}
	
	public Integer getChatRoomByUserId(int userId1, int userId2) {
		return chatRoomBO.getChatRoomByUserId1AndUserId2(userId1, userId2);
	}
	
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
	
	public List<MessageEntity> getMessageListByChatRoomId(int chatRoomId){
		return messageRepository.findByChatroomId(chatRoomId);
	}
	
}
