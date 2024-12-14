package com.example.bookVillage.book.bo;

import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Locale;
import java.util.TimeZone;

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
	
	public BookEntity addBookEntity(String isbn13, String title, String  cover, String description, String author, String publisher, String date, String category) {
		
	   Date pubdate = null;
		
		try {
			SimpleDateFormat originalFormatter = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss z", Locale.ENGLISH);
		    originalFormatter.setTimeZone(TimeZone.getTimeZone("GMT"));

		    // 날짜 파싱
		    pubdate = originalFormatter.parse(date);

		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		java.sql.Date sqlPubDate = new java.sql.Date(pubdate.getTime());
		
		BookEntity book = bookRepository.save(
				BookEntity.builder()
				.isbn13(isbn13)
				.title(title)
				.cover(cover)
				.description(description)
				.author(author)
				.publisher(publisher)
				.pubdate(sqlPubDate)
				.category(category)
				.build()
				);
		return book;
	}
}
