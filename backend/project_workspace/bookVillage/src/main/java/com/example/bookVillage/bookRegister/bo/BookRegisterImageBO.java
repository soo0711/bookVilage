package com.example.bookVillage.bookRegister.bo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookRegister.entity.BookRegisterImageEntity;
import com.example.bookVillage.bookRegister.repository.BookRegisterImageRepository;

@Service
public class BookRegisterImageBO {
	
	@Autowired
	private BookRegisterImageRepository bookRegisterImageRepository;
	
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
	
	public List<BookRegisterImageEntity> getBookRegisterImageByBookRegisterId(int bookRegisterId){
		return bookRegisterImageRepository.getBookRegisterImageByBookRegisterId(bookRegisterId);
	}
	
	public void deleteBookRegisterImageByBookRegisterId(int bookRegisterId){
		List<BookRegisterImageEntity> bookRegisterImageEntity = bookRegisterImageRepository.getBookRegisterImageByBookRegisterId(bookRegisterId);
		
		for (BookRegisterImageEntity book : bookRegisterImageEntity) {
			bookRegisterImageRepository.delete(book);
		}
	}
	
	

}
