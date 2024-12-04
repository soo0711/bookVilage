package com.example.bookVillage.personalSchedule;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.personalSchedule.bo.PersonalScheduleBO;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/personal-schdule")
public class PersonalScheduleRestController {
	
	@Autowired
	private PersonalScheduleBO personalSchduleBO;

	// 개인일정 create
	@PostMapping("/create")
	public Map<String, Object> personalSchduleCreate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer userId = (Integer) session.getAttribute("userId");
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		// personal db insert
		Integer personalSchduleId = personalSchduleBO.addpersonalSchdule(userId, bookMeetingId);
		
		Map<String, Object> result = new HashMap<>();
		if(personalSchduleId != null) {
			result.put("code", 200);
			result.put("result", "성공");
		} else {
			result.put("code", 500);
			result.put("result", "개인 독서 모임일정 생성 실패");
		}
		return result;
	}
	
	// 개인 일정 삭제
	@DeleteMapping("/delete")
	public  Map<String, Object> personalSchduleDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer userId = (Integer) session.getAttribute("userId");
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		// 삭제 bo
		int count = personalSchduleBO.deletePersonalSchdeuleByUserIdAndBookMeetingId(userId, bookMeetingId);
		
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
}
