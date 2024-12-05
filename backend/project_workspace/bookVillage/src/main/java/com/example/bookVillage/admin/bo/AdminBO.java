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
	
}
