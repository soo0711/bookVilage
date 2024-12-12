package com.example.bookVillage.bookMeeting.bo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity.BookMeetingEntityBuilder;
import com.example.bookVillage.bookMeeting.repository.BookMeetingRepository;
import com.example.bookVillage.wishList.entity.WishListEntity;

@Service
public class BookMeetingBO {
	@Autowired
	private BookMeetingRepository bookMeetingRepository;
	
	public Integer addBookMeeting(String subject, String content,String hostLoginid, String schedule,
			String place, int total) {
		
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.save(
				(BookMeetingEntity.builder())
				.hostLoginid(hostLoginid)
				.subject(subject)
				.content(content)
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
	
	public int updateBookMeeting(int bookMeetingId, String userLoginId, String subject, String content, String schedule, String place, int total) {
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.findById(bookMeetingId);
		if(bookMeetingEntity != null) {
			bookMeetingEntity = bookMeetingEntity.toBuilder() // 기존 내용은 그대로
					.subject(subject)
					.content(content)
	                .schedule(schedule)
	                .place(place)
	                .total(total)
	                .build();
			bookMeetingRepository.save(bookMeetingEntity); // 데이터 있으면 수정
			return 1;
		}
		return 0;
	}
	
	public int deleteBookMeeting(int bookMeetingId) {
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.findById(bookMeetingId);
		if (bookMeetingEntity != null) {
			bookMeetingRepository.delete(bookMeetingEntity);
			
			return 1;
		}
		
		return 0;
	}
	
	public void updateCurrent(int bookMeetingId) {
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.findById(bookMeetingId);
		bookMeetingEntity = bookMeetingEntity.toBuilder()
				.current(bookMeetingEntity.getCurrent() + 1)
				.build();
		bookMeetingRepository.save(bookMeetingEntity); // 데이터 있으면 수정
	}


	public List<BookMeetingEntity> findAll() {
		return bookMeetingRepository.findAll();
	}


	public List<BookMeetingEntity> findByPlace(String place) {
		return bookMeetingRepository.findByPlaceContaining(place);
	}


	public void updateBookMeetingCurrent(int bookMeetingId) {
		BookMeetingEntity bookMeetingEntity = bookMeetingRepository.findById(bookMeetingId);
		bookMeetingEntity = bookMeetingEntity.toBuilder()
				.current(bookMeetingEntity.getCurrent() - 1)
				.build();
		bookMeetingRepository.save(bookMeetingEntity); // 데이터 있으면 수정
	}

}
