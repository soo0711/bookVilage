package com.example.bookVillage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.bookVillage.common.FileManagerService;


@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
	
	
	// 웹 이미지 path와 서버에 업로드 된 실제 이미지와 매핑 설정
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		
		registry
		.addResourceHandler("/images/**") // web path: http://localhost/images/aaaa_1234354/gg.png
		.addResourceLocations("file:///" + FileManagerService.FILE_UPLOAD_PATH); // 실제 이미지 파일 위치
		
	}
	
	 @Override
	    public void addViewControllers(ViewControllerRegistry registry) {
	        registry.addViewController("/{spring:\\w+}")
	                .setViewName("forward:/index.html");
	        registry.addViewController("/**/{spring:\\w+}")
	                .setViewName("forward:/index.html");

	    }


}