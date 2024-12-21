package com.example.bookVillage.proxy.bo;

import java.util.List;
import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ProxyBO {

    private final RestTemplate restTemplate;

    public ProxyBO() {
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> getRecommendBooks(String isbn) {
        String url = "http://localhost:8000/recommend/" + isbn;
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        return response.getBody();
    }

    public List<Map<String, Object>> getRecommendUser(String userId) {
        String url = "http://localhost:8000/recommend_user/" + userId;
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        return response.getBody();
    }

    public Map<String, Object> getKeywordData(String isbn) {
        String url = "http://localhost:8000/keyword/" + isbn;
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                null, 
                new ParameterizedTypeReference<Map<String, Object>>() {}
        );
        return response.getBody();
    }
}
