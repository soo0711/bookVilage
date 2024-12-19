package com.example.bookVillage.region;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.region.bo.RegionBO;

@RestController
@RequestMapping("/api/region")
public class RegionRestController {

	@Autowired
	private RegionBO regionBO;
	
	@PostMapping("/sido")
	public Map<String, Object> sidoList(){
		
		List<String> sido = regionBO.getSidoList();
		
		Map<String, Object> result = new HashMap<>();
		if (!sido.isEmpty()) {
	        result.put("code", 200);
	        result.put("result", "성공"); 
	        result.put("sido", sido);
        } else {
	        result.put("code", 500);
	        result.put("error_message", "시/도를 불러오지 못했습니다."); 
        }
	    return result;
	}
	
	@PostMapping("/sigungu")
	public Map<String, Object> sigunguList(
			@RequestBody Map<String, String> requestBody) {
		
        String sido = requestBody.get("sido");
		
		List<String> sigungu = regionBO.getSigunguList(sido);
		
		Map<String, Object> result = new HashMap<>();
		if (!sigungu.isEmpty()) {
	        result.put("code", 200);
	        result.put("result", "성공"); 
	        result.put("sigungu", sigungu);
        } else {
	        result.put("code", 500);
	        result.put("error_message", "시/군/구를 불러오지 못했습니다."); 
        }
	    return result;
	}
	
	@PostMapping("/emdonge")
	public Map<String, Object> emdongeList(
			@RequestBody Map<String, String> requestBody) {
		
        String sido = requestBody.get("sido");
        String sigungu = requestBody.get("sigungu");
		
		List<String> emdonge = regionBO.getEmdongeList(sido, sigungu);
		
		Map<String, Object> result = new HashMap<>();
		if (!emdonge.isEmpty()) {
	        result.put("code", 200);
	        result.put("result", "성공"); 
	        result.put("sido", emdonge);
        } else {
	        result.put("code", 500);
	        result.put("error_message", "읍/면/동을 불러오지 못했습니다."); 
        }
	    return result;
	}
}
