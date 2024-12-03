package com.example.bookVillage.bookRegister;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.bookVillage.bookRegister.bo.BookRegisterBO;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/book-register")
public class BookRegisterRestCotroller {
	
	@Autowired
	private BookRegisterBO bookregisterBO;

	// 책 등록
	@PostMapping("/create")
	public Map<String, Object> BookRegisterCreate(
			@RequestPart("metadata") Map<String, String> metadata, // 이미지랑 받기 위해서 requestPart로 JSON 따로 file 따로 받기
	        @RequestPart("images") List<MultipartFile> files,
			HttpSession session){
		
		Integer userId = (Integer)session.getAttribute("userId");
		String userLoginId = (String)session.getAttribute("userLoginId");
		String title = metadata.get("title");
		String author = metadata.get("author");
		String publisher = metadata.get("publisher");
		String review = metadata.get("review");
		String point = metadata.get("point");
		String b_condition = metadata.get("b_condition");
		String description = metadata.get("description");
		String place = metadata.get("place");

		Integer BookRegisterId = bookregisterBO.addBookRegisterAndImage(userId, userLoginId, title, author, publisher,
				review, point, b_condition, description, place, files);
	
		
		Map<String, Object> result = new HashMap<>();

		if(BookRegisterId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "책 등록 실패"); // 이미 책이 등록되어 있는 경우
		}
		
		return result;
	}
	
	// 책 수정
	@PostMapping("/update")
	public Map<String, Object> BookRegisterUpdate(
			@RequestBody Map<String, String> requestBody, 
			// 이미지 수정 가능하게 할 지 고민
			HttpSession session){
		
		Integer userId = (Integer)session.getAttribute("userId");
		Integer bookRegisterId = Integer.parseInt(requestBody.get("bookRegisterId"));
		String review = requestBody.get("review");
		String point = requestBody.get("point");
		String b_condition = requestBody.get("b_condition");
		String description = requestBody.get("description");
		String place = requestBody.get("place");

		Integer BookRegisterId = bookregisterBO.updateBookRegister(userId, bookRegisterId, review, point, b_condition, description, place);
		
		Map<String, Object> result = new HashMap<>();

		if(BookRegisterId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "책 수정 실패");
		}
		
		return result;
	}
	
	// 책 삭제
	@DeleteMapping("/delete")
	public Map<String, Object> BookRegisterDelete(
			@RequestBody Map<String, String> requestBody, 
			HttpSession session){
		
		Integer userId = (Integer)session.getAttribute("userId");
		Integer bookRegisterId = Integer.parseInt(requestBody.get("bookRegisterId"));

		Integer delete = bookregisterBO.deleteBookRegister(userId, bookRegisterId);
		
		Map<String, Object> result = new HashMap<>();
		if (delete == 1) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "책 삭제 실패");
		}
	
		return result;
	}
	
	
	
}
