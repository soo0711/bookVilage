package com.example.bookVillage.bookRegister.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.bookRegister.entity.BookRegisterImageEntity;

public interface BookRegisterImageRepository extends JpaRepository<BookRegisterImageEntity, Integer>{

	public List<BookRegisterImageEntity> getBookRegisterImageByBookRegisterId(int bookRegisterId);
}
