package com.example.bookVillage.message.entity;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@ToString
@Table(name = "chat_room ")
@Getter
@Builder(toBuilder = true) 
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "userId1")
	private int userId1;
	
	@Column(name = "userId2")
	private int userId2;
	
	
	@Column(name = "createdAt", updatable = false)
	@UpdateTimestamp
	private Date createdAt;

}
