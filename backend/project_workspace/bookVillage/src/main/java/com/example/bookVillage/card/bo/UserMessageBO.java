package com.example.bookVillage.card.bo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;
import com.example.bookVillage.card.entity.BookCardEntity;
import com.example.bookVillage.card.entity.UserMessageEntity;
import com.example.bookVillage.message.bo.ChatRoomBO;
import com.example.bookVillage.message.bo.MessageBO;
import com.example.bookVillage.message.entity.ChatRoomEntity;
import com.example.bookVillage.message.entity.MessageEntity;
import com.example.bookVillage.user.bo.UserBO;
import com.example.bookVillage.user.entity.UserEntity;

@Service
public class UserMessageBO {

	@Autowired
	private UserBO userBO;
	
	@Autowired
	private ChatRoomBO chatRoomBO;
	
	@Autowired
	private MessageBO messageBO;
	
	
	public UserMessageEntity getUserMessageEntityByChatRoomId(int chatRoomId){
		
		UserMessageEntity userMessageEntity = new UserMessageEntity();
		
		//채팅방 
		ChatRoomEntity chatRoom = chatRoomBO.getChatRoomEntityByChatRoomId(chatRoomId);
		
		//사용자 1
		UserEntity user1 = userBO.getUserEntityById(chatRoom.getUserId1());
		
		//사용자 2
		UserEntity user2 = userBO.getUserEntityById(chatRoom.getUserId2());
		
		List<UserEntity> userList = new ArrayList<>();
		userList.add(user1);
		userList.add(user2);
		
		
		List<MessageEntity> messageList = messageBO.getMessageListByChatRoomId(chatRoomId);
		
		userMessageEntity.setUserList(userList);
		userMessageEntity.setChatRoom(chatRoom);
		userMessageEntity.setMessageList(messageList);
		
		
		return userMessageEntity;
		
	}
	
	
}
