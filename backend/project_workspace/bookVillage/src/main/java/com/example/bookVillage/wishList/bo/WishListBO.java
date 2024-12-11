package com.example.bookVillage.wishList.bo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.community.entity.CommunityEntity;
import com.example.bookVillage.wishList.entity.WishListEntity;
import com.example.bookVillage.wishList.repository.WishListRepository;

@Service
public class WishListBO {
	@Autowired
	private WishListRepository wishListRepository;
	
	public Integer addWishList(int userId, String isbn13) {
		WishListEntity wishListEntity = wishListRepository.save(
				(WishListEntity.builder())
				.userId(userId)
				.isbn13(isbn13)
				.build()
				);
		
		return wishListEntity == null? null : wishListEntity.getId();
	}

	public List<WishListEntity> getWishListEntityListByUserId(int userId) {
		
		return wishListRepository.findByUserId(userId);

	}
	
	
	public int deleteWishList(int wishListId) {
		
		WishListEntity wishListEntity = wishListRepository.findById(wishListId).orElse(null);
		if (wishListEntity != null) {
			wishListRepository.delete(wishListEntity);
			
			return 1;
		}
		
		return 0;

	}
	
	public WishListEntity getWishListEntityByWishListId(int wishListId) {
		
		return wishListRepository.findById(wishListId).orElse(null);

	}
	

}
