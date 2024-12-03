package com.example.bookVillage.bookRegister.bo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;
import com.example.bookVillage.bookRegister.entity.BookRegisterImageEntity;
import com.example.bookVillage.bookRegister.repository.BookRegisterImageRepository;
import com.example.bookVillage.bookRegister.repository.BookRegisterRepository;
import com.example.bookVillage.common.FileManagerService;

@Service
public class BookRegisterBO {

	@Autowired
	private BookRegisterRepository bookRegisterRepository;
	
	@Autowired
	private BookRegisterImageRepository bookRegisterImageRepository;
	
	@Autowired
	private FileManagerService fileManagerService;
	
	
	public Integer addBookRegisterAndImage(Integer userId, String userLoginId, String title, String author, String publisher, String review, 
								String point, String b_condition, String description, String place, List<MultipartFile> files) {
		if (bookRegisterRepository.getByUserIdAndTitle(userId, title) == null) {
			
		BookRegisterEntity bookRegisterEntity = bookRegisterRepository.save(
				BookRegisterEntity.builder()
				.userId(userId)
				.title(title)
				.author(author)
				.publisher(publisher)
				.review(review)
				.point(point)
				.b_condition(b_condition)
				.description(description)
				.place(place)
				.build()
				);
		
		// 이미지 저장
		List<String> imagePath = fileManagerService.saveFile(userLoginId, files);
		
		// 이미지 insert
		addBookRegisterImage(bookRegisterEntity.getId(), imagePath);	
		
		return bookRegisterEntity.getId();
		
		} 
		
		return null;
	
	}
	
	public void addBookRegisterImage(Integer bookRegisterId, List<String> imagePath) {
		for (String image : imagePath) {
			bookRegisterImageRepository.save(
				BookRegisterImageEntity.builder()
				.bookRegisterId(bookRegisterId)
				.imagePath(image)
				.build()
				);
		}
	}
	
	public Integer updateBookRegister(int userId, int bookRegisterId, String review, String point, String b_condition, String description, String place) {
		BookRegisterEntity bookRegisterEntity = bookRegisterRepository.getByIdAndUserId(bookRegisterId, userId);
		if (bookRegisterEntity != null) {
			bookRegisterEntity = bookRegisterEntity.toBuilder() // 기존 내용은 그대로
	                .review(review)
	                .point(point)
	                .b_condition(b_condition)
	                .description(description)
	                .place(place)
	                .build();
			bookRegisterRepository.save(bookRegisterEntity); // 데이터 있으면 수정
			
			return bookRegisterEntity.getId();
		}
		return null;
	}
	
	public Integer deleteBookRegister(int userId, int bookRegisterId) {
		BookRegisterEntity bookRegisterEntity = bookRegisterRepository.getByIdAndUserId(bookRegisterId, userId);
		
		if (bookRegisterEntity != null) {
			bookRegisterRepository.delete(bookRegisterEntity);
			
			return 1; // 삭제 성공
		}
		
		return 0; // 삭제 실패
	}
}
