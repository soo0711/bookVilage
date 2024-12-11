package com.example.bookVillage.region.repostiory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.bookVillage.region.entity.RegionEntity;

public interface RegionRepository extends JpaRepository<RegionEntity, Integer>{
	
	@Query(value="select sido from region group by sido;", nativeQuery=true)
	public List<String> findRegionSido();
	
	@Query(value="select distinct sigungu from region where sido = :sido", nativeQuery=true)
	public List<String> findRegionSigungu(@Param("sido") String sido);
	
	@Query(value="select distinct emdonge FROM region WHERE sido = :sido AND sigungu = :sigungu;", nativeQuery=true)
	public List<String> findRegionEmdonge(@Param("sido") String sido, @Param("sigungu") String sigungu);

}
