package com.example.bookVillage.bookMeeting.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.bookMeeting.repository.BookMeetingRepository;
import com.example.bookVillage.user.entity.UserEntity;

@Service
public class BookMeetingBO {
	@Autowired
	private BookMeetingRepository bookMeetingRepository;
	
	public Integer addBookMeeting(String hostLoginid, String schedule,
			String place, int total) {
		
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.save(
				BookMeetingEntity.builder()
				.hostLoginid(hostLoginid)
				.schedule(schedule)
				.place(place)
				.closeYN("N")
				.total(total)
				.build()
				);
		
		return bookMeetingEntity == null? null : bookMeetingEntity.getId();
	}
	
	
	// input: loginId	output: UserEntity		로그인 아이디 select
	public BookMeetingEntity getBookMeetingEntityByBookMeetingId(int bookMeetingId) {
		return bookMeetingRepository.findById(bookMeetingId);
	}
	
	public void updateBookMeeting(int bookMeetingId, String userLoginId, String schedule, String place, int total) {
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.findById(bookMeetingId);
		bookMeetingEntity = bookMeetingEntity.toBuilder() // 기존 내용은 그대로
                .schedule(schedule)
                .place(place)
                .total(total)
                .build();
		bookMeetingRepository.save(bookMeetingEntity); // 데이터 있으면 수정
		
	}
	
	public int deleteBookMeeting(int bookMeetingId) {
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.findById(bookMeetingId);
		if (bookMeetingEntity != null) {
			bookMeetingRepository.delete(bookMeetingEntity);
			
			return 1;
		}
		
		return 0;
	}

}
