package com.example.bookVillage.bookRegister.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;

public interface BookRegisterRepository extends JpaRepository<BookRegisterEntity, Integer>{

	public BookRegisterEntity getByIdAndUserId(int bookRegister, int userId);
	
	
	public BookRegisterEntity getByUserIdAndTitle(int userId, String title);
}
