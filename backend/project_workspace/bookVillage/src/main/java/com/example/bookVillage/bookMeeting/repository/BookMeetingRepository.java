package com.example.bookVillage.bookMeeting.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.user.entity.UserEntity;

public interface BookMeetingRepository extends JpaRepository<BookMeetingEntity, Integer>{
	// null or UserEntity(단건)
	public BookMeetingEntity findById(int bookMeetingId);

	public List<BookMeetingEntity> findByPlaceContaining(String place);

	public List<BookMeetingEntity> findByHostLoginid(String userLoginid);
}
