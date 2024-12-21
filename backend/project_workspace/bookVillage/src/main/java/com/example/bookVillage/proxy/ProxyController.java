package com.example.bookVillage.proxy;


import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate; 

@RestController
@CrossOrigin(origins = {"http://localhost:60031", "http://ceprj.gachon.ac.kr:60031"}, allowCredentials = "true")
@RequestMapping("/api")
public class ProxyController {

    private final RestTemplate restTemplate;

    public ProxyController() {
        this.restTemplate = new RestTemplate();
    }

    @GetMapping("/recommend/{isbn}")
    public ResponseEntity<?> proxyRecommend(@PathVariable String isbn) {
        try {
            String fastApiUrl = "http://localhost:8000/recommend/" + isbn;
            ResponseEntity<Map> response = restTemplate.getForEntity(fastApiUrl, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping("/recommend_user/{userId}")
    public ResponseEntity<?> proxyRecommendUser(@PathVariable String userId) {
        try {
            String fastApiUrl = "http://localhost:8000/recommend_user/" + userId;
            ResponseEntity<Map> response = restTemplate.getForEntity(fastApiUrl, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping("/keyword/{isbn}")
    public ResponseEntity<?> proxyKeyword(@PathVariable String isbn) {
        try {
            String fastApiUrl = "http://localhost:8000/keyword/" + isbn;
            ResponseEntity<Map> response = restTemplate.getForEntity(fastApiUrl, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
}


