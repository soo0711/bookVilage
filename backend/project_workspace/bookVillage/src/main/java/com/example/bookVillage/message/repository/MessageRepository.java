package com.example.bookVillage.message.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.message.entity.MessageEntity;

public interface MessageRepository extends JpaRepository<MessageEntity, Integer>{

	public List<MessageEntity> findByChatRoomId(int chatRoomId);

}
