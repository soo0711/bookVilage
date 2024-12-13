package com.example.bookVillage.card.entity;

import java.util.List;

import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;
import com.example.bookVillage.user.entity.UserEntity;
import com.example.bookVillage.wishList.entity.WishListEntity;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class UserBookRegisterEntity {

	private UserEntity user;
	
	private BookRegisterEntity bookRegister;
	
	private List<WishListEntity> wishList;
}
