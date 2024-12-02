package com.example.bookVillage.oauth;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.ToString;

@Data
@Component
@ToString
public class AladinOauth {

	@Value("${aladin.ttbkey}")
	private String aladinToken;
	
	@Value("${aladin.url}")
	private String aladinUrl;
	
	public ResponseEntity<?> getAladinAuthUrl(
			@RequestParam("title") String title, 
    		HttpServletRequest request) throws Exception {
		/* 
		 * http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?
		 * ttbkey=[TTBKey]&Query=aladdin&QueryType=Title&MaxResults=10&start=1&SearchTarget=Book&output=xml&Version=20131101
		 */
        String reqUrl = aladinUrl + "?ttbkey=" + aladinToken + "&Query=" + title
                + "&QueryType=Title";

        // RestTemplate을 사용하여 외부 API를 호출하고 응답을 받아옴
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(reqUrl, String.class);
        
        // 응답이 XML일 경우, JSON으로 변환하거나, XML 그대로 반환할 수 있음
        // 예시에서는 JSON으로 반환
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("response", response); // Aladin API의 응답
        
        return ResponseEntity.ok(result); // JSON 형식으로 응답
	}
}
