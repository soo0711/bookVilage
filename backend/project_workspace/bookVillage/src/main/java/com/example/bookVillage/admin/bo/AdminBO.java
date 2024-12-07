package com.example.bookVillage.admin.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookRegister.bo.BookRegisterBO;
import com.example.bookVillage.community.bo.CommunityBO;
import com.example.bookVillage.communityComment.bo.CommunityCommentBO;
import com.example.bookVillage.message.bo.MessageBO;
import com.example.bookVillage.personalSchedule.bo.PersonalScheduleBO;
import com.example.bookVillage.user.bo.UserBO;

@Service
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
	
	@Autowired
	private PersonalScheduleBO personalScheduleBO;
	
	
	//책 등록 삭제
	public Integer deleteBookRegister(int userId, int bookRegisterId) {
		return bookRegisterBO.deleteBookRegister(userId, bookRegisterId);
	}
	
	//user 수정
	public Integer adminUpdateUser(String loginId, String name, String phoneNumber, String email) {
		return userBO.updateUser(loginId, name, email, phoneNumber);
	}

	//커뮤니티 수정
	public int adminUpdateCommunity(Integer communityId, String subject, String content) {
		return communityBO.updateCommunity( communityId,  subject,  content);
	}
	
	//커뮤니티 삭제
	public int adminDeleteCommunity(int communityId) {
		return communityBO.deleteCommunity(communityId);
	}
	
	//커뮤니티 댓글 삭제
	public int adminDeleteCommunityComment(int communityCommentId) {
		return communityCommentBO.deleteCommunityComment(communityCommentId);
	}
	
	//독서 모임 삭제
	public int adminDeletebookMeeting(int bookMeetingId) {
		return bookMettingBO.deleteBookMeeting(bookMeetingId);
	}
	
	//개인 일정 삭제
	public int adminDeletePersonalSchedule(int personalScheduleId) {
		return personalScheduleBO.deletePersonalSchdeule(personalScheduleId);
	}
	
}
