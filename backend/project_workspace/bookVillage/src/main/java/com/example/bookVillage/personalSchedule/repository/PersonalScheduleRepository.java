package com.example.bookVillage.personalSchedule.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;

public interface PersonalScheduleRepository extends JpaRepository<PersonalScheduleEntity, Integer>{

	public PersonalScheduleEntity findByUserIdAndBookMeetingId(Integer userId, Integer bookMeetingId);

	public List<PersonalScheduleEntity> findByUserId(int userId);
	
	public PersonalScheduleEntity findByBookMeetingId(int bookMeetingId);
}
