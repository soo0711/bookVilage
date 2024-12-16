package com.example.bookVillage.book.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.book.repository.BookRepository;

@Service
public class BookBO {
	
	@Autowired
	private BookRepository bookRepository;

	public BookEntity getBookByIsbn13(String isbn13) {
		BookEntity book = bookRepository.findByIsbn13(isbn13);
		return book;
	}
}
