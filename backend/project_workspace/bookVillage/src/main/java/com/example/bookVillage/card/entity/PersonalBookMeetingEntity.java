package com.example.bookVillage.card.entity;

import java.util.List;

import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PersonalBookMeetingEntity {

	private PersonalScheduleEntity personalSchedule;
	
	private BookMeetingEntity bookMeeting;
}
