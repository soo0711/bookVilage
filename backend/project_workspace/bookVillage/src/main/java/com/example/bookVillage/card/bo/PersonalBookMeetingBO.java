package com.example.bookVillage.card.bo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.card.entity.PersonalBookMeetingEntity;
import com.example.bookVillage.personalSchedule.bo.PersonalScheduleBO;
import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;

@Service
public class PersonalBookMeetingBO {

	@Autowired
	private PersonalScheduleBO personalScheduleBO;
	
	@Autowired
	private BookMeetingBO bookMeetingBO;
	
	public List<PersonalBookMeetingEntity> getPersonalBookMeetingList(int userId){
		List<PersonalBookMeetingEntity> personalBookMeetingList = new ArrayList<>();
		
		List<PersonalScheduleEntity> personalScheduleList = personalScheduleBO.getPersonalScheduleEntityListByUSerId(userId);
		
		for(int i = 0; i < personalScheduleList.size(); i++) {
			PersonalBookMeetingEntity personalBookMeetingEntity = new PersonalBookMeetingEntity();
			
			personalBookMeetingEntity.setPersonalSchedule(personalScheduleList.get(i));
			personalBookMeetingEntity.setBookMeeting(bookMeetingBO.getBookMeetingEntityByBookMeetingId(personalScheduleList.get(i).getBookMeetingId()));
			
			personalBookMeetingList.add(personalBookMeetingEntity);
		}
		
		
		return personalBookMeetingList;
	}
}
