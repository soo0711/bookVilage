package com.example.bookVillage.community.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.community.entity.CommunityEntity;

public interface CommunityRepository extends JpaRepository<CommunityEntity, Integer>{

	//public CommunityEntity findById(int communityId);
}
