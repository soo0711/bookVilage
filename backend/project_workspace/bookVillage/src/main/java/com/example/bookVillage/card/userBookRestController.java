package com.example.bookVillage.card;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.card.bo.UserBookBO;
import com.example.bookVillage.card.entity.BookCardEntity;
import com.example.bookVillage.card.entity.UserBookEntity;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user-book")
public class userBookRestController {	
	
	@Autowired
	private UserBookBO userBookBO; // userBook에센 userBookBO만!
	
	@PostMapping("/user-profile")
	public Map<String , Object> userBookProfie(
			@RequestBody Map<String, String> requestBody, 
			HttpSession session){
		int userId = Integer.parseInt(requestBody.get("userId"));
		int myId = (Integer) session.getAttribute("userId");
		
		UserBookEntity userBook = userBookBO.getUserBookByUserId(userId);
		
		Map<String, Object> result = new HashMap<>();
	    if (userBook != null) {
	        result.put("code", 200);
	        result.put("result", "성공");
	        result.put("data", userBook);
	        result.put("myId", myId);
	    } else {
	        result.put("code", 404);
	        result.put("result", "사용자 정보를 찾을 수 없습니다.");
	    }
	    
	    return result;
		
	}
	
	@GetMapping("/point-list")
	public Map<String , Object> userBookPointList(){ 
		
		List<BookCardEntity> bookCardList = userBookBO.getUserBookList();
		Map<String, Object> result = new HashMap<>();
		if (bookCardList.isEmpty() == false) {
	        result.put("code", 200);
	        result.put("result", "성공");
	        result.put("bookCardList", bookCardList);
	    } else {
	        result.put("code", 404);
	        result.put("result", "사용자 정보를 찾을 수 없습니다.");
	    }
	    
	    return result;

	}
}
