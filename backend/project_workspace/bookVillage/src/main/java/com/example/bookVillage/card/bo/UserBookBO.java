package com.example.bookVillage.card.bo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.book.bo.BookBO;
import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.bookRegister.bo.BookRegisterBO;
import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;
import com.example.bookVillage.card.entity.BookCardEntity;
import com.example.bookVillage.card.entity.UserBookEntity;
import com.example.bookVillage.user.bo.UserBO;

@Service
public class UserBookBO {
	@Autowired
	private UserBO userBO;
	
	@Autowired
	private BookRegisterBO bookRegisterBO;
	
	@Autowired
	private BookBO bookBO;
	
	public UserBookEntity getUserBookByUserId(int userId) {
		//userBook 카드 생성 -  userEntity와 bookCardList필요
		UserBookEntity userBook = new UserBookEntity();
		
		//userBook에 사용자 정보 저장
		userBook.setUser(userBO.getUserEntityById(userId));
		
		//userBook에 사용자가 등록한 책 정보 저장
		List<BookCardEntity> bookCardList = new ArrayList<>();
		
		List<BookRegisterEntity> bookRegisterList = bookRegisterBO.getBookRegisterByUserId(userId);
		for(int i = 0; i<bookRegisterList.size(); i++) {
			
			String isbn = bookRegisterList.get(i).getIsbn13();
			BookEntity book = bookBO.getBookByIsbn13(isbn);
			
			BookCardEntity bookCard =	new BookCardEntity();
			bookCard.setBook(book);
			bookCard.setBookRegister(bookRegisterList.get(i));
			
			bookCardList.add(bookCard);
			
		}
		
		userBook.setBookCardList(bookCardList);
		
		return userBook;
	}
	
	public List<BookCardEntity> getUserBookList(){
		
		List<BookCardEntity> bookCardList = new ArrayList<>();
		
		List<Object[]> bookRegisterList = bookRegisterBO.getBookAvgPoint();
		
		for(Object[] bookRegister : bookRegisterList) {
			
			Double avg = (Double) bookRegister[0];
			String avg_toString = Double.toString(avg);
			String isbn = (String) bookRegister[1];
			
			BookEntity book = bookBO.getBookByIsbn13(isbn);
			
			BookCardEntity bookCard =	new BookCardEntity();
			
			BookRegisterEntity bookRegisterEntity = new BookRegisterEntity();
			bookRegisterEntity.setIsbn13(isbn);
			bookRegisterEntity.setPoint(avg_toString);
			
			bookCard.setBook(book);
			bookCard.setBookRegister(bookRegisterEntity);
			
			bookCardList.add(bookCard);
			
		}

		
		return bookCardList;
	}
	
	
	
}
