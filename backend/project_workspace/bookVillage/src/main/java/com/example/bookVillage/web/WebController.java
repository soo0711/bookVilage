package com.example.bookVillage.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping("/**/{path:[^\\.]*}")
    public String forwardToReact() {
        return "forward:/index.html";  // 모든 경로를 index.html로 포워딩
    }
}



