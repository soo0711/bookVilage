package com.example.bookVillage.communityComment.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.communityComment.entity.CommunityCommentEntity;
import com.example.bookVillage.communityComment.repository.CommunityCommentRepository;

@Service
public class CommunityCommentBO {
	@Autowired
	private CommunityCommentRepository communityCommentRepository;
	
	public Integer addCommunityComment(int communityId, int userId, String content) {

		CommunityCommentEntity communityCommentEntity = communityCommentRepository.save(
				(CommunityCommentEntity.builder())
				.communityId(communityId)
				.userId(userId)
				.content(content)
				.build()
				);
		
		return communityCommentEntity == null? null : communityCommentEntity.getId();
	}

	public CommunityCommentEntity getCommunityCommentEntityByCommunityId(int communityCommentId) {

		return communityCommentRepository.findById(communityCommentId).orElse(null);
	}

	public int deleteCommunityComment(int communityCommentId) {
		CommunityCommentEntity communityCommentEntity = communityCommentRepository.findById(communityCommentId).orElse(null);
		if (communityCommentEntity != null) {
			communityCommentRepository.delete(communityCommentEntity);
			
			return 1;
		}
		
		return 0;
	}

}
