package com.example.bookVillage.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.user.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer>{
	// null or UserEntity(단건)
	public UserEntity findByLoginId(String loginId);
	
	// null or UserEntity
	public UserEntity findByLoginIdAndPassword(String loginId, String password);
	
	// null or UserEntity
	public UserEntity findByNameAndPhoneNumberAndEmail(String name, String phoneNumber, String email);
	
	public UserEntity findById(int userId);
}
