package com.example.bookVillage.region.bo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookVillage.region.repostiory.RegionRepository;

@Service
public class RegionBO {
	
	@Autowired
	private RegionRepository regionRepository;

	
	public List<String> getSidoList(){
		return regionRepository.findRegionSido();
	}
	
	public List<String> getSigunguList(String sido){
		return regionRepository.findRegionSigungu(sido);
	}
	
	public List<String> getEmdongeList(String sido, String sigungu){
		return regionRepository.findRegionEmdonge(sido, sigungu);
	}
}
