package com.example.bookVillage.menuCard;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class menuCardController {

	@GetMapping("/home-view")
	public String homeView(
			Model model) {
		
		return "template/layout";
	}
}
