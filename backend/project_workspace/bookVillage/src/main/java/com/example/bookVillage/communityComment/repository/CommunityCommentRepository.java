package com.example.bookVillage.communityComment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.communityComment.entity.CommunityCommentEntity;

public interface CommunityCommentRepository extends JpaRepository<CommunityCommentEntity, Integer>{

}
