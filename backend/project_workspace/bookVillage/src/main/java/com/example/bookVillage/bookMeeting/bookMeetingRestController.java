package com.example.bookVillage.bookMeeting;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookMeeting.bo.BookMeetingServiceBO;
import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/bookMeeting")
@RestController
public class bookMeetingRestController {
	@Autowired 
	private BookMeetingBO bookMeetingBO;
	
	@Autowired 
	private BookMeetingServiceBO bookMeetingServieBO;
	
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
		Integer userId = (Integer) session.getAttribute("userId");
		
		String subject = requestBody.get("subject"); //제목 
		String content = requestBody.get("content"); //내용
		String schedule = requestBody.get("schedule");//일정
		String place = requestBody.get("place");//장소
		Integer total = Integer.parseInt(requestBody.get("total"));//모집인원
		

		// bookmeeting db insert
		Integer bookMeetingId = bookMeetingBO.addBookMeeting(subject, content, userLoginId, schedule, place, total);
		
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
		
		String subject = requestBody.get("subject"); //제목 
		String content = requestBody.get("content"); //내용
		String place = requestBody.get("place");
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		//로그인한 사용
		String userLoginId = (String) session.getAttribute("userLoginId");
		
		//bookMeetingId로 주최자가 로그인한 사람인지 비교
		BookMeetingEntity bookMeetingEntity = bookMeetingBO.getBookMeetingEntityByBookMeetingId(bookMeetingId);
	
		int count = 0;
		if(bookMeetingEntity.getHostLoginid().equals(userLoginId)) {
			count = bookMeetingBO.updateBookMeeting(bookMeetingId, subject, content, place);
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
	
	@PostMapping("/delete")
	public Map<String, Object> delete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		int count = bookMeetingServieBO.deleteBookMeeting(bookMeetingId);
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

	
	@PostMapping("/list")
	public Map<String, Object> list(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		
		List<BookMeetingEntity> bookMeetingList = bookMeetingBO.findAll();
		Map<String, Object> result = new HashMap<>();
		if (bookMeetingList != null && !bookMeetingList.isEmpty()) {
	        // 채팅방이 존재하는 경우
	        result.put("code", 200);
	        result.put("result", "성공");
	        result.put("bookMeetingList", bookMeetingList);  // 채팅방 목록을 전달
	    } else {
	        // 채팅방이 없는 경우
	        result.put("code", 204); // No Content
	        result.put("result", "등록된 독서모임 일정이 없습니다.");
	    }

		return result;
	}
	
	@PostMapping("/listByRegion")
	public Map<String, Object> listByRegion(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		String place = requestBody.get("place");
		
		List<BookMeetingEntity> bookMeetingList = bookMeetingBO.findByPlace(place);
		Map<String, Object> result = new HashMap<>();
		if (bookMeetingList != null && !bookMeetingList.isEmpty()) {
	        // 채팅방이 존재하는 경우
	        result.put("code", 200);
	        result.put("result", "성공");
	        result.put("bookMeetingListByplace", bookMeetingList);  // 채팅방 목록을 전달
	    } else {
	        // 채팅방이 없는 경우
	        result.put("code", 204); // No Content
	        result.put("result", "해당 지역에 독서모임 일정이 없습니다.");
	    }

		return result;
	}
	
	@PostMapping("/detail")
	public Map<String, Object> BookMeetingDeatil(
			@RequestBody Map<String, String> requestBody,
			HttpSession session) {
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		 
		BookMeetingEntity bookMeetingEntity = bookMeetingBO.getBookMeetingEntityById(bookMeetingId);
		Map<String, Object> result = new HashMap<>();
		if (bookMeetingEntity != null) {
	        // 채팅방이 존재하는 경우
	        result.put("code", 200);
	        result.put("result", "성공");
	        result.put("bookMeetingEntity", bookMeetingEntity);  // 채팅방 목록을 전달
	    } else {
	        result.put("code", 500); 
	        result.put("result", "해당하는 독서모임이 없습니다.");
	    }

		return result;
	}
}
