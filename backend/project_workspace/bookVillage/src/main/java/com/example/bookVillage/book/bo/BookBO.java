package com.example.bookVillage.book.bo;

import java.sql.Date;

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
	
	public BookEntity addBookEntity(String isbn13, String title, String  cover, String description, String author, String publisher, Date pubdate, String category) {
		
		BookEntity book = bookRepository.save(
				BookEntity.builder()
				.isbn13(isbn13)
				.title(title)
				.cover(cover)
				.description(description)
				.author(author)
				.publisher(publisher)
				.pubdate(pubdate)
				.category(category)
				.build()
				);
		return book;
	}
}
