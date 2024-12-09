package com.example.bookVillage.card.entity;

import java.util.List;

import com.example.bookVillage.user.entity.UserEntity;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class UserBookEntity {
	private List<BookCardEntity> bookCardList;

	private UserEntity user;
	
}
