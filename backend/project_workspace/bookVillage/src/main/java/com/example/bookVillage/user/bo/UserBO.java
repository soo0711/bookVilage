package com.example.bookVillage.user.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.user.entity.UserEntity;
import com.example.bookVillage.user.repository.UserRepository;

@Service
public class UserBO {

	@Autowired
	private UserRepository userRepository;
	
	public Integer addUser(String loginId, String password,
			String name, String phoneNumber, String email) {
		
		UserEntity userEntity = userRepository.save(
				UserEntity.builder()
				.loginId(loginId)
				.password(password)
				.name(name)
				.phoneNumber(phoneNumber)
				.email(email)
				.build()
				);
		
		return userEntity == null? null : userEntity.getId();
	}
	
	
	// input: loginId	output: UserEntity		로그인 아이디 select
	public UserEntity getUserEntityByLoginId(String loginId) {
		return userRepository.findByLoginId(loginId);
	}
	
	// input: loginId, hasedpw		output: UserEntity		로그인 아이디, 비밀번호 select
	public UserEntity getUserEntityByLoginIdPassword(String loginId, String password) {
		return userRepository.findByLoginIdAndPassword(loginId, password);
	}
	
	// input: name, phoneNumber, email 		output:UserEntity	name, phoneNumber, email select
	public UserEntity getUserEntityByNamePhoneNumberEmail(String name, String phoneNumber, String email) {
		return userRepository.findByNameAndPhoneNumberAndEmail(name, phoneNumber, email);
	}

}
