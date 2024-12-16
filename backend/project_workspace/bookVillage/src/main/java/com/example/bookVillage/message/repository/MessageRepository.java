package com.example.bookVillage.message.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.message.entity.MessageEntity;

public interface MessageRepository extends JpaRepository<MessageEntity, Integer>{

}
