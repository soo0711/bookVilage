package com.example.bookVillage.wishList;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.card.bo.BookWishListBO;
import com.example.bookVillage.card.entity.BookWishListEntity;
import com.example.bookVillage.user.bo.UserBO;
import com.example.bookVillage.wishList.bo.WishListBO;
import com.example.bookVillage.wishList.entity.WishListEntity;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:60031")
@RestController
@RequestMapping("/api/wishList")
public class WishListRestController {

	@Autowired
	private WishListBO wishListBO;
	
	@Autowired
	private BookWishListBO bookWishListBO;
	
	@Autowired
	private UserBO userBO;
	
	@PostMapping("/create")
	public Map<String, Object> wishListCreate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		int userId = (int) session.getAttribute("userId");
		String isbn13 = requestBody.get("isbn13");
		

		// wishList db insert
		Integer wishListId = wishListBO.addWishList(userId, isbn13);
			
		Map<String, Object> result = new HashMap<>();
		if(wishListId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "커뮤니티 글 등록 실패");
		}

	
		return result;
	}
	
	
	@PostMapping("/delete")
	public Map<String, Object> delete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		
		String isbn13 = requestBody.get("isbn13");
		
		int userId = (int) session.getAttribute("userId");
		
		
		Map<String, Object> result = new HashMap<>();
		
		int count = 0;
		
		
		
		count = wishListBO.deleteWishList(userId, isbn13);
		
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "삭제에 실패했습니다.");
		}

		return result;
	}
	
	
	@PostMapping("/list")
	public Map<String, Object> wishList(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		int userId = (int) session.getAttribute("userId");
		//UserEntity user = userBO.getUserEntityById(userId);

		// wishList db insert
		List<WishListEntity> wishList = wishListBO.getWishListEntityListByUserId(userId);
		
		Map<String, Object> result = new HashMap<>();
		
		
		if(wishList != null) {
			result.put("code", 200);
			result.put("result", "성공");
			result.put("date", wishList);
		} else {
			result.put("code", 204); // No Content
	        result.put("result", "위시리스트가 없습니다.");
		}

	
		return result;
	}
	
	@PostMapping("/mypage-list")
	public Map<String, Object> myPageWishList(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		int userId = (int) session.getAttribute("userId");

		// wishList db insert
		List<BookWishListEntity> wishList = bookWishListBO.getWishList(userId);
		
		Map<String, Object> result = new HashMap<>();
		
		
		if(wishList != null) {
			result.put("code", 200);
			result.put("result", "성공");
			result.put("date", wishList);
		} else {
			result.put("code", 204); // No Content
	        result.put("result", "위시리스트가 없습니다.");
		}

	
		return result;
	}
}
