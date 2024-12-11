package com.example.bookVillage.region.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@ToString
@Table(name = "region")
@Getter
@Setter
@Builder(toBuilder = true) 
@NoArgsConstructor
@AllArgsConstructor
public class RegionEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String sido;
	
	private String sigungu;
	
	private String emdonge;

}
