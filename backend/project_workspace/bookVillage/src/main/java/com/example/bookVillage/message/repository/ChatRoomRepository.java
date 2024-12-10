
package com.example.bookVillage.message.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.message.entity.ChatRoomEntity;

public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity, Integer>{

	public ChatRoomEntity findChatRoomByUserId1AndUserId2(int userId1, int userId2);
	
	public ChatRoomEntity findById(int chatRoomId);
	
	public List<ChatRoomEntity> findByUserId1OrUserId2(int userId1, int userId2);
}



