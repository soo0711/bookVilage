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
import com.example.bookVillage.personalSchedule.entity.PersonalScheduleEntity;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/personal-schdule")
public class PersonalScheduleRestController {
	
	@Autowired
	private PersonalScheduleBO personalScheduleBO;

	// 개인일정 create
	@PostMapping("/create")
	public Map<String, Object> personalSchduleCreate(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer userId = (Integer) session.getAttribute("userId");
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		Map<String, Object> result = new HashMap<>();
		
		//독서모임 일정에 이미 참여 되어있는지 확인
		PersonalScheduleEntity personalSchedule = personalScheduleBO.getPersonalScheduleByUserIdAndBookMeetingId(userId, bookMeetingId);
		if(personalSchedule != null) {
			result.put("code", 204);
			result.put("result", "이미 참여한 독서모임 입니다.");
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
	@DeleteMapping("/delete")
	public  Map<String, Object> personalSchduleDelete(
			@RequestBody Map<String, String> requestBody,
			HttpSession session){
		
		Integer userId = (Integer) session.getAttribute("userId");
		Integer bookMeetingId = Integer.parseInt(requestBody.get("bookMeetingId"));
		
		// 삭제 bo
		int count = personalScheduleBO.deletePersonalSchdeuleByUserIdAndBookMeetingId(userId, bookMeetingId);
		
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
