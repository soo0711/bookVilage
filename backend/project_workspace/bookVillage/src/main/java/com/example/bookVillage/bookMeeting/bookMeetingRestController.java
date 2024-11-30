package com.example.bookVillage.bookMeeting;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;

import jakarta.servlet.http.HttpSession;

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
			@RequestParam("schedule") String schedule,
			@RequestParam("place") String place,
			@RequestParam("total") int total,
			HttpSession session){
		

		String userLoginId = (String) session.getAttribute("userLoginId");
		// user db insert
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
			@RequestParam("schedule") String schedule,
			@RequestParam("place") String place,
			@RequestParam("total") int total,
			@RequestParam("bookMeetingId") int bookMeetingId,
			HttpSession session){
		
		//로그인한 사용자
		String userLoginId = (String) session.getAttribute("userLoginId");
		
		//bookMeetingId로 주최자가 로그인한 사람인지 비교
		BookMeetingEntity bookMeetingEntity = bookMeetingBO.getBookMeetingEntityByBookMeetingId(bookMeetingId);
	
		if(bookMeetingEntity.getHostLoginid() == userLoginId) {
			bookMeetingBO.updateBookMeeting(bookMeetingId, userLoginId, schedule, place, total);
		}
		
		
		Map<String, Object> result = new HashMap<>();
		result.put("code", 200);
		result.put("result", "독서모임 수정 성공");
		

	
		return result;
	}
	
	@DeleteMapping("/delete")
	public Map<String, Object> delete(@RequestParam("bookMeetingId") int bookMeetingId, HttpSession session) {
		
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
