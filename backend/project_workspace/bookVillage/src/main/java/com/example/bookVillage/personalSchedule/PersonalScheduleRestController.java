package com.example.bookVillage.personalSchedule;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.bookMeeting.bo.BookMeetingBO;
import com.example.bookVillage.bookMeeting.entity.BookMeetingEntity;
import com.example.bookVillage.card.bo.PersonalBookMeetingBO;
import com.example.bookVillage.card.entity.PersonalBookMeetingEntity;
import com.example.bookVillage.personalSchedule.bo.PersonalScheduleBO;
import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/personal-schdule")
public class PersonalScheduleRestController {
	
	@Autowired
	private PersonalScheduleBO personalScheduleBO;
	
	@Autowired
	private BookMeetingBO bookMeetingBO;
	
	@Autowired
	private PersonalBookMeetingBO personalBookMeetingBO;

	// 개인일정 create
	@PostMapping("/create")
	public Map<String, Object> personalSchduleCreate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer userId = (Integer) session.getAttribute("userId");
		String userLoginId = (String) session.getAttribute("userLoginId");
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		Map<String, Object> result = new HashMap<>();
		
		//독서모임 일정에 이미 참여 되어있는지 확인
		PersonalScheduleEntity personalSchedule = personalScheduleBO.getPersonalScheduleByUserIdAndBookMeetingId(userId, bookMeetingId);
		if(personalSchedule != null) {
			result.put("code", 204);
			result.put("result", "이미 참여한 독서모임 입니다.");
			return result;
		}
		
		BookMeetingEntity bookMeeting = bookMeetingBO.getBookMeetingEntityByBookMeetingId(bookMeetingId);
		if(bookMeeting.getHostLoginid().equals(userLoginId)) {
			result.put("code", 204);
			result.put("result", "해당 모임의 주최자로 참가하기 누를 수 없습니다. ");
			return result;
		}
		
		
		// personal db insert
		Integer personalSchduleId = personalScheduleBO.addpersonalSchdule(userId, bookMeetingId);
		
		if(personalSchduleId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "독서모임 참가 실패");
		}
		return result;
	}
	
	// 개인 일정 삭제
	@PostMapping("/delete")
	public  Map<String, Object> personalSchduleDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer userId = (Integer) session.getAttribute("userId");
		int personalSchduleId = Integer.parseInt(requestBody.get("eventId"));
		
		PersonalScheduleEntity personalScheduleEntity = personalScheduleBO.getPersonalScheduleEntityListById(personalSchduleId);
		int bookMeetingId = personalScheduleEntity.getBookMeetingId();
		// 삭제 bo
		int count = personalScheduleBO.deletePersonalSchdeuleByUserIdAndBookMeetingId(userId, bookMeetingId);
		bookMeetingBO.updateBookMeetingCurrent(bookMeetingId);
		// 응답값
		Map<String, Object> result = new HashMap<>();
		if(count > 0) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("error_message", "개인 독서 모임 일정 삭제에 실패했습니다.");
		}
		
		return result;
	}
	
	@PostMapping("/list")
	public  Map<String, Object> personalSchduleList(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		String userLoginId = (String) session.getAttribute("userLoginId");
		Integer userId = (Integer) session.getAttribute("userId");
		List<PersonalBookMeetingEntity> personalBookMeetingList = personalBookMeetingBO.getPersonalBookMeetingList(userId);
		List<BookMeetingEntity> bookMeetingEntity = bookMeetingBO.getBookMeetingEntityByHostLoginId(userLoginId);
		Map<String, Object> result = new HashMap<>();
		if (personalBookMeetingList != null && !personalBookMeetingList.isEmpty()) {
	        // 채팅방이 존재하는 경우
	        result.put("code", 200);
	        result.put("result", "성공");
	        result.put("data", personalBookMeetingList);  // 채팅방 목록을 전달
	        result.put("host", bookMeetingEntity);  // 채팅방 목록을 전달
	    } else {
	        // 채팅방이 없는 경우
	        result.put("code", 204); // No Content
	        result.put("result", "참여한 독서 모임이 없습니다.");
	    }
		return result;
	}
}
