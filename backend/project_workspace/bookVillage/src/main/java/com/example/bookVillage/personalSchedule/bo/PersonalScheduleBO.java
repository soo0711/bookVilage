package com.example.bookVillage.personalSchedule.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;
import com.example.bookVillage.personalSchedule.repository.PersonalScheduleRepository;

@Service
public class PersonalScheduleBO {
	
	@Autowired
	private PersonalScheduleRepository personalScheduleRepository;
	

	public Integer addpersonalSchdule(Integer userId, Integer bookMeetingId) {
		
		PersonalScheduleEntity personScheduleEntity = personalScheduleRepository.save(
				PersonalScheduleEntity.builder()
				.userId(userId)
				.bookMeetingId(bookMeetingId)
				.build()
				);
		
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

}
