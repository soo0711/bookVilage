package com.example.bookVillage.wishList.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bookVillage.wishList.entity.WishListEntity;

public interface WishListRepository extends JpaRepository<WishListEntity, Integer>{

	public List<WishListEntity> findByUserId(int userId);

	public WishListEntity findByUserIdAndIsbn13(int userId, String isbn13);

}
