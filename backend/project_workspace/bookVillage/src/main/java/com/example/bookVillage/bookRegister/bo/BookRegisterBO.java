package com.example.bookVillage.bookRegister.bo;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookVillage.book.bo.BookBO;
import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;
import com.example.bookVillage.bookRegister.entity.BookRegisterImageEntity;
import com.example.bookVillage.bookRegister.repository.BookRegisterRepository;
import com.example.bookVillage.common.FileManagerService;

@Service
public class BookRegisterBO {

	@Autowired
	private BookRegisterRepository bookRegisterRepository;
	
	@Autowired
	private BookRegisterImageBO bookRegisterImageBO;
	
	@Autowired
	private FileManagerService fileManagerService;
	
	@Autowired
	private BookBO bookBO;
	
	
	public Integer addBookRegisterAndImage(Integer userId, String userLoginId, String title, String isbn13, String review, 
								String point, String b_condition, String description, String exchange_YN, String place, List<MultipartFile> files) {
		if (bookRegisterRepository.getByUserIdAndIsbn13(userId, isbn13) == null) { //중복 확인 후
			
			String status = "교환 가능";
			if (exchange_YN.equals("N") ) {
				status = "교환 불가";
				place = null;
				b_condition = null;
				description = null;
			}
			
		BookRegisterEntity bookRegisterEntity = bookRegisterRepository.save( // 등록
				BookRegisterEntity.builder()
				.userId(userId)
				.title(title)
				.isbn13(isbn13)
				.review(review)
				.point(point)
				.b_condition(b_condition)
				.description(description)
				.exchange_YN(exchange_YN)
				.place(place)
				.status(status)
				.build()
				);
		
		if (files != null) {
			// 이미지 저장
			List<String> imagePath = fileManagerService.saveFile(userLoginId, files);
			
			// 이미지 insert
			bookRegisterImageBO.addBookRegisterImage(bookRegisterEntity.getId(), imagePath);	
		}
		
		return bookRegisterEntity.getId();
		
		} 
		
		return null;
	
	}
	
	
	public Integer updateBookRegister(int userId, String userLoginId, int bookRegisterId, String review, String point, String b_condition, String description, 
			String place, String status, String exchange_YN, List<MultipartFile> files) {
		
		BookRegisterEntity bookRegisterEntity = bookRegisterRepository.getByIdAndUserId(bookRegisterId, userId);		
		
		if (exchange_YN.equals("N") ) {
			status = "교환 불가";
			place = null;
			b_condition = null;
			description = null;
		}
	
	
		if (files != null) {
			// 원래 사진 삭제
			List<BookRegisterImageEntity> bookImage = bookRegisterImageBO.getBookRegisterImageByBookRegisterId(bookRegisterId);
						
			if (bookImage.size() != 0) {
				// 이미지 select - List<String>에 imgPath 넣기
				List<String> imagePath = new ArrayList<>();
				
				for (int i = 0 ; i < bookImage.size(); i++) {
					imagePath.add(bookImage.get(i).getImagePath());
				}
				
				// 이미지 삭제
				fileManagerService.deleteFile(imagePath);
				
				bookRegisterImageBO.deleteBookRegisterImageByBookRegisterId(bookRegisterId);
					
			}
			
			// 이미지 저장
			List<String> imagePath = fileManagerService.saveFile(userLoginId, files);
			
			// 이미지 insert
			bookRegisterImageBO.addBookRegisterImage(bookRegisterEntity.getId(), imagePath);	
		}
		
		
		if (bookRegisterEntity != null) {
			bookRegisterEntity = bookRegisterEntity.toBuilder() // 기존 내용은 그대로
	                .review(review)
	                .point(point)
	                .b_condition(b_condition)
	                .description(description)
	                .place(place)
	                .status(status)
	                .exchange_YN(exchange_YN)
	                .build();
			bookRegisterRepository.save(bookRegisterEntity); // 데이터 있으면 수정
			
			return bookRegisterEntity.getId();
		}
		
		return null;
	}
	
	public Integer deleteBookRegisterById(int bookRegisterId) {
		BookRegisterEntity bookRegisterEntity = bookRegisterRepository.findById(bookRegisterId).orElse(null);
		
		if (bookRegisterEntity != null) {
			
			List<BookRegisterImageEntity> bookImage = bookRegisterImageBO.getBookRegisterImageByBookRegisterId(bookRegisterId);
			
			if (bookImage.size() != 0) {
			// 이미지 select - List<String>에 imgPath 넣기
			List<String> imagePath = new ArrayList<>();
			
			for (int i = 0 ; i < bookImage.size(); i++) {
				imagePath.add(bookImage.get(i).getImagePath());
			}
			
				// 이미지 삭제
				fileManagerService.deleteFile(imagePath);
				
				bookRegisterImageBO.deleteBookRegisterImageByBookRegisterId(bookRegisterId);
				
			}
			
			bookRegisterRepository.delete(bookRegisterEntity);
		}
		
		return 1; 
	}
	
	public Integer deleteBookRegister(int userId, int bookRegisterId) {
		BookRegisterEntity bookRegisterEntity = bookRegisterRepository.getByIdAndUserId(bookRegisterId, userId);
		
		if (bookRegisterEntity != null) {
			
			List<BookRegisterImageEntity> bookImage = bookRegisterImageBO.getBookRegisterImageByBookRegisterId(bookRegisterId);
			
			if (bookImage.size() != 0) {
			// 이미지 select - List<String>에 imgPath 넣기
			List<String> imagePath = new ArrayList<>();
			
			for (int i = 0 ; i < bookImage.size(); i++) {
				imagePath.add(bookImage.get(i).getImagePath());
			}
			
				// 이미지 삭제
				fileManagerService.deleteFile(imagePath);
				
				bookRegisterImageBO.deleteBookRegisterImageByBookRegisterId(bookRegisterId);
				
			}
			
			bookRegisterRepository.delete(bookRegisterEntity);
		}
		
		return 1; 
	}


	public List<BookRegisterEntity> getBookRegisterByUserId(int userId) {
		
		return bookRegisterRepository.findByUserId(userId);
	}
	
	public List<BookRegisterEntity> getBookRegisterByIsbn13(String isbn13, int userId) {
		
		return bookRegisterRepository.findByIsbn13AndUserIdNot(isbn13, userId);
	}
	
	public List<Object[]> getBookAvgPoint(){
		return bookRegisterRepository.findBookAvgPoint();
	}

	public BookEntity addBookEntity(String isbn13, String title,String  cover, String description, String author, String publisher, String date, String category) {
		
		BookEntity book = bookBO.getBookByIsbn13(isbn13);
		if (book == null) {
			// 등록
			book = bookBO.addBookEntity(isbn13, title, cover, description, author, publisher, date, category);
		}
		return book;
	}
	
	public BookRegisterEntity getBookRegisterBookEntity(int bookRegisterId, int userId) {
		return bookRegisterRepository.findByIdAndUserId(bookRegisterId, userId);
	}

	public List<BookRegisterEntity> getBookRegisterList(int userId) {
		return bookRegisterRepository.findByUserId(userId);
	}
	
	public List<BookRegisterImageEntity> getBookRegisterImageEntity(int bookRegisterId, int userId){
		return bookRegisterImageBO.getBookRegisterImageByBookRegisterId(bookRegisterId);
	}


	public List<BookRegisterEntity> getBookRegisterByPlaceAndTitle(String place, String title, int userId) {
		return bookRegisterRepository.findByPlaceContainingAndTitleContainingAndUserIdNot(place, title, userId);
	}


	public List<BookRegisterEntity> getBookRegisterByPlace(String place, int userId) {
		return bookRegisterRepository.findByPlaceAndUserIdNot(place, userId);
	}
	
}
