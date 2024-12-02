package com.example.bookVillage.personalSchedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;

public interface PersonalScheduleRepository extends JpaRepository<PersonalScheduleEntity, Integer>{

	public PersonalScheduleEntity findByUserIdAndBookMeetingId(Integer userId, Integer bookMeetingId);
}
