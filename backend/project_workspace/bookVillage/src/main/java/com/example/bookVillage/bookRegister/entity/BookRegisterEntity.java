package com.example.bookVillage.bookRegister.entity;

import java.util.Date;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Getter
@ToString
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "book_register")
public class BookRegisterEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name="userId")
	private int userId;
	
	private String title; 
	
	private String author; 
	
	private String publisher; 
	
	private String review; 
	
	private String point;
	
	private String b_condition; 
	
	private String description; 
	
	private String place;
	
	@Column(name = "createdAt", updatable = false)
	@UpdateTimestamp
	private Date createdAt; 
	
	@Column(name = "updatedAt")
	@UpdateTimestamp
	private Date updatedAt; 
}
