package com.example.bookVillage.admin.bo;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookRegister.bo.BookRegisterBO;
import com.example.bookVillage.community.bo.CommunityBO;
import com.example.bookVillage.communityComment.bo.CommunityCommentBO;
import com.example.bookVillage.message.bo.MessageBO;
import com.example.bookVillage.user.bo.UserBO;

public class AdminBO {
	
	@Autowired
	private UserBO userBO;
	
	@Autowired
	private BookMeetingBO bookMeetingBO;
	
	@Autowired
	private BookRegisterBO bookRegisterBO;
	
	@Autowired
	private CommunityBO communityBO;
	
	@Autowired
	private CommunityCommentBO communityCommentBO;
	
	@Autowired
	private MessageBO messageBO;
	
	@Autowired
	private BookMeetingBO bookMettingBO;
	
	public Integer deleteBookRegister(int userId, int bookRegisterId) {
		return bookRegisterBO.deleteBookRegister(userId, bookRegisterId);
	}
	
	public Integer adminUpdateUserByPassword(String loginId, String password, String name, String phoneNumber, String email) {
		return userBO.updateUserByPassword(loginId, password, name, email, phoneNumber);
	}
	
	public Integer adminUpdateUser(String loginId, String name, String phoneNumber, String email) {
		return userBO.updateUser(loginId, name, email, phoneNumber);
	}
	
}
