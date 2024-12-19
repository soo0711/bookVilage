package com.example.bookVillage.proxy;

import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/fastapi")
public class ProxyController {

    @Value("${fastapi.url}")
    private String fastapiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @RequestMapping(value = "/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
    public ResponseEntity<?> proxy(
            @RequestBody(required = false) String body,
            @RequestParam(required = false) Map<String, String> queryParams,
            HttpServletRequest request
    ) {
        String path = request.getRequestURI().substring("/api/fastapi".length());
        String url = fastapiUrl + path;

        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        HttpHeaders headers = new HttpHeaders();
        headers.setAll(Collections.list(request.getHeaderNames()).stream()
                .collect(Collectors.toMap(Function.identity(), request::getHeader)));

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        return restTemplate.exchange(url, method, entity, String.class);
    }
}


