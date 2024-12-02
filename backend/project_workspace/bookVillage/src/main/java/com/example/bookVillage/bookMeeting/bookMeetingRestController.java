package com.example.bookVillage.bookMeeting;

import java.util.HashMap;
import java.util.Map;

import org.antlr.v4.runtime.ParserInterpreter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/bookMeeting")
@RestController
public class bookMeetingRestController {
	@Autowired 
	private BookMeetingBO bookMeetingBO;
	
	/**
	 * 
	 * @param schedule
	 * @param place
	 * @param total
	 * @param session
	 * @return
	 */
	@PostMapping("/create")
	public Map<String, Object> bookMeetingCreate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		String userLoginId = (String) session.getAttribute("userLoginId");
		
		String schedule = requestBody.get("schedule");
		String place = requestBody.get("place");
		Integer total = Integer.parseInt(requestBody.get("total"));
		

		// bookmeeting db insert
		Integer bookMeetingId = bookMeetingBO.addBookMeeting(userLoginId, schedule, place, total);
		
		Map<String, Object> result = new HashMap<>();
		if(bookMeetingId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "독서모임 생성 실패");
		}

	
		return result;
	}
	
	@PostMapping("/update")
	public Map<String, Object> bookMeetingUpdate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		String schedule = requestBody.get("schedule");
		String place = requestBody.get("place");
		Integer total = Integer.parseInt(requestBody.get("total"));
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		//로그인한 사용자
		String userLoginId = (String) session.getAttribute("userLoginId");
		
		//bookMeetingId로 주최자가 로그인한 사람인지 비교
		BookMeetingEntity bookMeetingEntity = bookMeetingBO.getBookMeetingEntityByBookMeetingId(bookMeetingId);
	
		int count = 0;
		if(bookMeetingEntity.getHostLoginid().equals(userLoginId)) {
			count = bookMeetingBO.updateBookMeeting(bookMeetingId, userLoginId, schedule, place, total);
		}
		
		
		Map<String, Object> result = new HashMap<>();
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "독서모임 수정 성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "수정에 실패했습니다.");
		}
		

	
		return result;
	}
	
	@DeleteMapping("/delete")
	public Map<String, Object> delete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		int count = bookMeetingBO.deleteBookMeeting(bookMeetingId);
		// 응답값
		Map<String, Object> result = new HashMap<>();
		if(count > 0 ) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "삭제에 실패했습니다.");
		}

		return result;
	}

}
