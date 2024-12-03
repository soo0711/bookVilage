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
		
		return bookRegisterEntity == null? null : bookRegisterEntity.getId();
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
}
