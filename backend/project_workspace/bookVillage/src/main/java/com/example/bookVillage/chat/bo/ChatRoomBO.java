package com.example.bookVillage.chat.bo;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.chat.entity.ChatRoomEntity;
import com.example.bookVillage.chat.repository.ChatRoomRepository;

@Service
public class ChatRoomBO {

	@Autowired
	private ChatRoomRepository chatRoomRepository;
	
	public Integer addChatRoom(int userId1, int userId2) {
		
	    int max = Math.max(userId1, userId2);
	    int min = Math.min(userId1, userId2);
	    
		ChatRoomEntity chatRoomEntity = chatRoomRepository.save(
				ChatRoomEntity.builder()
				.userId1(min)
				.userId2(max)
				.build()
				);
					
		return chatRoomEntity == null ? null : chatRoomEntity.getId();
	}
	
	public Integer getChatRoomByUserId1AndUserId2(int userId1, int userId2) {
		
	    int max = Math.max(userId1, userId2);
	    int min = Math.min(userId1, userId2);
	    
		ChatRoomEntity chatRoomEntity = chatRoomRepository.findChatRoomByUserId1AndUserId2(min, max);
		return chatRoomEntity == null ? null : chatRoomEntity.getId();
	}
	

}
