package com.example.bookVillage.communityComment.entity;

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
@Table(name = "community_comment")
@Getter
@Builder(toBuilder = true) 
@NoArgsConstructor
@AllArgsConstructor
public class CommunityCommentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "communityId")
	private int communityId;
	
	@Column(name = "userId")
	private int userId;
	
	private String content;
	
	@Column(name = "createdAt", updatable = false)
	@UpdateTimestamp
	private Date createdAt;
	

}
