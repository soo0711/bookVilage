package com.example.bookVillage.book.entity;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "book")
public class BookEntity {

	@Id
	private String isbn13;

	
	private String title; 
	
	private String cover; 
	
	private String description; 
	
	private String author;
	
	private String publisher; 
	
	
	private String category; 
	
	
	private Date pubdate; 
	

}
