package com.example.bookVillage.bookMeeting.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.personalSchedule.bo.PersonalScheduleBO;

@Service
public class BookMeetingServiceBO {
	
	@Autowired
	private PersonalScheduleBO personalScheduleBO;
	
	@Autowired
	private BookMeetingBO bookMeetingBO;
	
	public int deleteBookMeeting(int bookMeetingId) {
		
		if (bookMeetingBO.deleteBookMeeting(bookMeetingId) > 0) {
			// 개인일정에 이 독서모임이 있으면 삭제
			personalScheduleBO.deletePersonalBookMeeting(bookMeetingId);
			return 1;
		};
		
		return 0;
	}
	
	
}
