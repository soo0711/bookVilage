package com.example.bookVillage.book;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.book.bo.BookBO;
import com.example.bookVillage.book.entity.BookEntity;
import com.example.bookVillage.oauth.AladinOauth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/book")
@RestController
public class BookRestController {

	@Autowired
	private AladinOauth aladinoauth;
	
	@Autowired
	private BookBO bookBO;
	
	@PostMapping("/search/title")
	public ResponseEntity<?> BookSearch(
			@RequestBody Map<String, String> requestBody, 
			HttpServletRequest request)throws Exception {
		
		String title = requestBody.get("title");
		
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "성공");
		
		return aladinoauth.getAladinAuthUrl(title, request);
	}
	
	@PostMapping("/detail")
	public Map<String, Object> BookDetail (
			@RequestBody Map<String, String> requestBody){
		String isbn13 = requestBody.get("isbn13");
		BookEntity book = bookBO.getBookByIsbn13(isbn13);
		
		Map<String, Object> result = new HashMap<>();
		if (book !=  null) {
			result.put("code", 200);
			result.put("result", "성공");
			result.put("book", book);
		} else {
			result.put("code", 500);
			result.put("error_message", "등록된 상세정보가 없습니다.");
		}
		return result;
	}
	
	@PostMapping("/create")
	   public Map<String, Object> BookCreate(
	         @RequestBody Map<String, String> requestBody,
	         HttpSession session){
	      
	      String title = requestBody.get("title");
	      String isbn13 = requestBody.get("isbn13");
	      String cover = requestBody.get("cover");
	      String description = requestBody.get("description");
	      String author = requestBody.get("author");
	      String publisher = requestBody.get("publisher");
	      String date = requestBody.get("pubdate");
	      String category = requestBody.get("category");
	      

	      Map<String, Object> result = new HashMap<>();
	      
	      // book DB 중복 및 등록
	      
	      BookEntity bookEntity = bookBO.getBookByIsbn13(isbn13);
	      if (bookEntity != null) {
		         result.put("code", 200);
		         result.put("result", "보유");
		         return result;
	      }
	      
	      bookEntity = bookBO.addBookEntity(isbn13, title, cover, description, author, publisher, date, category);
	   
	      if(bookEntity != null) {
	         result.put("code", 200);
	         result.put("result", "성공");
	      } else {
	         result.put("code", 500);
	         result.put("error_message", "책 등록 실패"); // 이미 책이 등록되어 있는 경우
	      }
	      
	      return result;
	   }
}
