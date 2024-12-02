package com.example.bookVillage.personalSchedule.entity;

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
@Getter
@Builder(toBuilder = true)
@Table(name="personal_schedule")
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PersonalScheduleEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "user_id")
	private Integer userId;
	
	@Column(name = "bookMeeting_id")
	private Integer bookMeetingId;
	
	
	@Column(name = "createdAt", updatable = false)
	@UpdateTimestamp
	private Date createdAt;

}
