package com.example.bookVillage.test;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TestController {

	@ResponseBody
	@RequestMapping("/test1")
	public String helloWorld() {
		return "Hello world!";
	}
	
	@ResponseBody
	@RequestMapping("/test2")
	public Map<String, Object> test2(){
		Map<String, Object> result = new HashMap<>();
		result.put("aaa", 11);
		result.put("bbb", 11);
		result.put("ccc", 11);
		return result;
	}
	

}
