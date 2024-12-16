package com.example.bookVillage.card.bo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.book.bo.BookBO;
import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.card.entity.BookWishListEntity;
import com.example.bookVillage.wishList.bo.WishListBO;
import com.example.bookVillage.wishList.entity.WishListEntity;

@Service
public class BookWishListBO {

	@Autowired
	private BookBO bookBO;
	
	@Autowired
	private WishListBO wishListBO;

	public List<BookWishListEntity> getWishList(int userId) {
	    List<BookWishListEntity> bookWishList = new ArrayList<>();
	    
	    List<WishListEntity> wishList = wishListBO.getWishListEntityListByUserId(userId);
	    
	    for (int i = 0; i < wishList.size(); i++) {
	        // BookWishListEntity 객체를 루프마다 새로 생성
	        BookWishListEntity bookWishListEntity = new BookWishListEntity();
	        
	        BookEntity book = bookBO.getBookByIsbn13(wishList.get(i).getIsbn13());
	        bookWishListEntity.setBook(book);
	        bookWishListEntity.setWishList(wishList.get(i));
	        
	        bookWishList.add(bookWishListEntity);
	    }
	    
	    return bookWishList;
	}

	
	
	
	
}
