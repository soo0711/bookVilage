package com.example.bookVillage.chat.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.chat.entity.ChatEntity;
import com.example.bookVillage.chat.repository.ChatRepository;

@Service
public class ChatBO {

	@Autowired
	private ChatRoomBO chatRoomBO;
	
	@Autowired
	private ChatRepository chatRepository;
	
	public Integer addChatRoom(int userId1, int userId2) {
		return chatRoomBO.addChatRoom(userId1, userId2);
	}
	
	public Integer getChatRoomByUserId(int userId1, int userId2) {
		return chatRoomBO.getChatRoomByUserId1AndUserId2(userId1, userId2);
	}
	
	public Integer addChatMessage(int chatRoomId, int userId, String message) {
		
		ChatEntity chatEntity = chatRepository.save(
				ChatEntity.builder()
				.chatRoomId(chatRoomId)
				.userId(userId)
				.message(message)
				.build()
				);
				
		return chatEntity == null ? null : chatEntity.getId();
	}
}
