package com.example.bookVillage.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping(value = {"/", "/home-view", "/user/sign-in-view", "/user/sign-up-view", "/find-id", "/find-password", 
                         "/book-recommend", "/BookMeeting", "/community", "/exchange-list/{bookId}", 
                         "/book-register", "/recommendation", "/chatlist", "/book/{isbn}", "/myPage", 
                         "/book/update", "/search", "/taste", "/modify-meeting/{meetingId}", 
                         "/profile/{userId}", "/chat/{chatRoomId}", "/exchange"})
    public String forward() {
        return "forward:/index.html";  // React의 index.html로 포워딩
    }
}


	
	
	
//    @GetMapping(value = "/**/{path:[^\\.]*}")
//    public String forwardToReact(HttpServletRequest request) {
//        String uri = request.getRequestURI();
//
//        // 정적 리소스 요청인지 확인
//        if (uri.matches(".*\\.(js|css|png|jpg|jpeg|gif|svg|ico)$")) {
//            return null; // Spring Boot의 정적 리소스 핸들러로 전달
//        }
//
//        // SPA 라우팅을 위해 index.html로 포워딩
//        return "forward:/index.html";
//    }
//}




