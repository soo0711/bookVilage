package com.example.bookVillage.bookRegister.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;

public interface BookRegisterRepository extends JpaRepository<BookRegisterEntity, Integer>{

	public BookRegisterEntity getByIdAndUserId(int bookRegister, int userId);
	
	
	public BookRegisterEntity getByUserIdAndIsbn13(int userId, String isbn13);


	public List<BookRegisterEntity> findByUserId(Integer userId);
}
