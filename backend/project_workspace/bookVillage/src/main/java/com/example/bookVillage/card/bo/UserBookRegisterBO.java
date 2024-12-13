package com.example.bookVillage.card.bo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookRegister.bo.BookRegisterBO;
import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;
import com.example.bookVillage.card.entity.UserBookRegisterEntity;
import com.example.bookVillage.user.bo.UserBO;
import com.example.bookVillage.user.entity.UserEntity;
import com.example.bookVillage.wishList.bo.WishListBO;
import com.example.bookVillage.wishList.entity.WishListEntity;

@Service
public class UserBookRegisterBO {

	@Autowired
	private UserBO userBO;
	
	@Autowired
	private BookRegisterBO bookRegisterBO;
	
	@Autowired
	private WishListBO wishListBO;
	
	public List<UserBookRegisterEntity> getUserBookRegisterByIsbn13(String isbn13, int userId){
		List<UserBookRegisterEntity> userBookRegisterList = new ArrayList<>();
		
		List<BookRegisterEntity> bookRegisterList = bookRegisterBO.getBookRegisterByIsbn13(isbn13, userId);
		for(int i =0; i<bookRegisterList.size(); i++) {
			int oterUserId = bookRegisterList.get(i).getUserId();
			
			UserEntity user = userBO.getUserEntityById(oterUserId);
			List<WishListEntity> wishList = wishListBO.getWishListEntityListByUserId(oterUserId);
			
			UserBookRegisterEntity userBookRegisetEntity = new UserBookRegisterEntity();
			userBookRegisetEntity.setUser(user);
			userBookRegisetEntity.setBookRegister(bookRegisterList.get(i));
			userBookRegisetEntity.setWishList(wishList);
			
			userBookRegisterList.add(userBookRegisetEntity);
		}
		
		return userBookRegisterList;
		
		
	}
}
