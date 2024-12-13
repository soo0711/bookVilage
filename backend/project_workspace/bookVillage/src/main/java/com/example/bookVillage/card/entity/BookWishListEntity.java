package com.example.bookVillage.card.entity;

import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;
import com.example.bookVillage.wishList.entity.WishListEntity;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class BookWishListEntity {
	private BookEntity book;
	private WishListEntity wishList;
}
