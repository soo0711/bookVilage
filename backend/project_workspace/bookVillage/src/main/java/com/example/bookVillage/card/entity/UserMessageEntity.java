package com.example.bookVillage.card.entity;

import java.util.List;

import com.example.bookVillage.message.entity.ChatRoomEntity;
import com.example.bookVillage.message.entity.MessageEntity;
import com.example.bookVillage.user.entity.UserEntity;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class UserMessageEntity {

	private List<UserEntity> userList;
	
	private ChatRoomEntity chatRoom;
	
	private List<MessageEntity> messageList;
}
