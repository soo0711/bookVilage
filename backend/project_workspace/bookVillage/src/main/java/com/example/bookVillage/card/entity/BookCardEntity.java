package com.example.bookVillage.card.entity;

import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class BookCardEntity {
	
	private BookEntity book;

	private BookRegisterEntity bookRegister;
}
