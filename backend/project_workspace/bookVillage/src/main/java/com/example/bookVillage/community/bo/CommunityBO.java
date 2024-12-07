package com.example.bookVillage.community.bo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.community.entity.CommunityEntity;
import com.example.bookVillage.community.repository.CommunityRepository;

@Service
public class CommunityBO {
	@Autowired
	private CommunityRepository communityRepository;
	
	public Integer addCommunity(int userId, String subject,String content) {
		
		CommunityEntity communityEntity = communityRepository.save(
				(CommunityEntity.builder())
				.userId(userId)
				.subject(subject)
				.content(content)
				.build()
				);
		
		return communityEntity == null? null : communityEntity.getId();
	}

	
	public CommunityEntity getCommunityEntityByCommunityId(int communityId) {
		
		return communityRepository.findById(communityId).orElse(null);

	}


	public int updateCommunity(Integer communityId, String subject, String content) {
	CommunityEntity communityEntity = communityRepository.findById(communityId).orElse(null);
	if(communityEntity != null) {
		communityEntity = communityEntity.toBuilder() // 기존 내용은 그대로
                .subject(subject)
                .content(content)
                .build();
		communityRepository.save(communityEntity); // 데이터 있으면 수정
		return 1;
	}
	return 0;
	
	}


	public int deleteCommunity(int communityId) {
		
		CommunityEntity communityEntity = communityRepository.findById(communityId).orElse(null);
		if (communityEntity != null) {
			communityRepository.delete(communityEntity);
			
			return 1;
		}
		
		return 0;

	}
}
