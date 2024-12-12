package com.example.bookVillage.personalSchedule.bo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.community.entity.CommunityEntity;
import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;
import com.example.bookVillage.personalSchedule.repository.PersonalScheduleRepository;

@Service
public class PersonalScheduleBO {
	
	@Autowired
	private PersonalScheduleRepository personalScheduleRepository;
	
	@Autowired
	private BookMeetingBO bookMeetingBO;
	

	public Integer addpersonalSchdule(Integer userId, Integer bookMeetingId) {
		
		PersonalScheduleEntity personScheduleEntity = personalScheduleRepository.save(
				PersonalScheduleEntity.builder()
				.userId(userId)
				.bookMeetingId(bookMeetingId)
				.build()
				);
		
		bookMeetingBO.updateCurrent(bookMeetingId); // curretn update
		
		return personScheduleEntity == null? null : personScheduleEntity.getId();
	}
	
	public int deletePersonalSchdeuleByUserIdAndBookMeetingId(Integer userId, Integer bookMeetingId) {
		PersonalScheduleEntity personSchduleEntity = personalScheduleRepository.findByUserIdAndBookMeetingId(userId, bookMeetingId);
		
		if (personSchduleEntity != null) {
			personalScheduleRepository.delete(personSchduleEntity);
			return 1;
		} 
		
		return 0;
		
	}
	
	public int deletePersonalSchdeule(int personalScheduleId) {
		
		PersonalScheduleEntity personSchduleEntity = personalScheduleRepository.findById(personalScheduleId).orElse(null);
		if (personSchduleEntity != null) {
			personalScheduleRepository.delete(personSchduleEntity);
			
			return 1;
		}
		
		return 0;

	}

	public PersonalScheduleEntity getPersonalScheduleByUserIdAndBookMeetingId(int userId, int bookMeetingId) {
		return personalScheduleRepository.findByUserIdAndBookMeetingId(userId, bookMeetingId);
	}
	
	public PersonalScheduleEntity getPersonalScheduleEntityListById(int personalScheduleId) {
		return personalScheduleRepository.findById(personalScheduleId).orElse(null);
	}

	public List<PersonalScheduleEntity> getPersonalScheduleEntityListByUSerId(int userId) {
		
		return personalScheduleRepository.findByUserId(userId);
	}

}
