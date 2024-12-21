package com.example.bookVillage.proxy;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookVillage.proxy.bo.ProxyBO;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:60031", "http://ceprj.gachon.ac.kr:60031"}, allowCredentials = "true")
public class ProxyController {

    @Autowired
    private ProxyBO proxyBo;

    @GetMapping("/recommend/{isbn}")
    public ResponseEntity<?> proxyRecommend(@PathVariable("isbn") String isbn) {
        return ResponseEntity.ok(proxyBo.getRecommendBooks(isbn));
    }

    @GetMapping("/recommend_user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> proxyRecommendUser(@PathVariable("userId") String userId) {
        List<Map<String, Object>> recommendUserList = proxyBo.getRecommendUser(userId);
        return ResponseEntity.ok(recommendUserList);
    }

    @GetMapping("/keyword/{isbn}")
    public ResponseEntity<?> proxyKeyword(@PathVariable("isbn") String isbn) {
        return ResponseEntity.ok(proxyBo.getKeywordData(isbn));
    }
}


