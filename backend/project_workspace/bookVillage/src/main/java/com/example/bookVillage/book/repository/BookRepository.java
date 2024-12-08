package com.example.bookVillage.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.book.entity.BookEntity;

public interface BookRepository extends JpaRepository<BookEntity, String>{

	public BookEntity findByIsbn13(String isbn13);

}
