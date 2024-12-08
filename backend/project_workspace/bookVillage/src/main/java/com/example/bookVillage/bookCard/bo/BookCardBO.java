package com.example.bookVillage.bookCard.bo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.book.bo.BookBO;
import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.bookCard.entity.BookCardEntity;
import com.example.bookVillage.bookRegister.bo.BookRegisterBO;
import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;

@Service
public class BookCardBO {
	@Autowired
	private BookRegisterBO bookRegisterBO;
	
	@Autowired
	private BookBO bookBO;
	
	
	
	public List<BookCardEntity> BookCard(int userId){
		
		List<BookCardEntity> bookCardList = new ArrayList<>();
		
		List<BookRegisterEntity> bookRegisterList = bookRegisterBO.getBookRegisterByUserId(userId);
		for(int i = 0; i< bookRegisterList.size(); i++) {
			String isbn = bookRegisterList.get(i).getIsbn13();
			BookEntity book = bookBO.getBookByIsbn13(isbn);
			
			BookCardEntity bookCard =	new BookCardEntity();
			bookCard.setBook(book);
			bookCard.setBookRegister(bookRegisterList.get(i));
			
			bookCardList.add(bookCard);
		}
		
		return bookCardList;
		
	}
	
	
	
	

	
}
