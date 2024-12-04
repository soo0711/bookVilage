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

import com.example.bookVillage.oauth.AladinOauth;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/book")
@RestController
public class BookRestController {

	@Autowired
	private AladinOauth aladinoauth;
	
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
	
}
