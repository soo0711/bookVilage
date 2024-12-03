package com.example.bookVillage.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component // spring bean
public class PermissionInterceptor implements HandlerInterceptor{
	// 못들어오게 막는 코드
//	@Override
//	public boolean preHandle(HttpServletRequest request,
//						HttpServletResponse response, Object handeler) {
//		// 요청 URL Path를 꺼낸다. (URL은 작은 의미, uri 큰 의미)
//		String uri = request.getRequestURI();
//		
//		log.info("[@@@@@@@@@ prehandle] uri: {}", uri);
//		
//		// 로그인 여부
//		HttpSession session = request.getSession();
//		Integer userId = (Integer)session.getAttribute("userId");
//		
//		// 비로그인 => 로그인 페이지로 이동, 컨트롤러 수행 방지
//		if (userId == null && (uri.startsWith("/order") || uri.startsWith("/user/update") || uri.startsWith("/cart") || uri.startsWith("/wish"))) {
//			response.sendRedirect("/user/sign-in-view");
//			return false; // 원래 요청에 대해서 컨트롤러 수행 X
//		}
//		
//		// 로그인 && /user/sign => 홈 페이지 이동, 컨트롤러 수행 방지
//		if (userId != null && uri.startsWith("/user/sign")) {
//			response.sendRedirect("/home-view");
//			return false; // 원래 요청에 대해서 컨트롤러 수행 X
//		}
//		
//		return true; // 컨트롤러 수행 - 접근을 허락하는 의미
//	}
//	
//	@Override
//	public void postHandle(HttpServletRequest request,
//			HttpServletResponse response, Object handeler,
//			ModelAndView mav) {
//		// view 객체가 있다는 건 아직 jsp가 html로 변환되기 전이라는 의미
//		log.info("[########## postHandle]");
//	}
//	
//	@Override
//	public void afterCompletion(HttpServletRequest request,
//			HttpServletResponse response, Object handeler,
//			Exception ex) {
//		// jsp가 html로 최종 변환된 후
//		log.info("[*********** afterCompletion]");
//	}
}
