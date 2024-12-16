package com.example.bookVillage.common;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FileManagerService {
	
	// 수현 노트북 이미지 저장
	public static final String FILE_UPLOAD_PATH = "C:\\Users\\수현\\Desktop\\학교\\3학년\\2학기\\프로젝트\\project\\backend\\project_workspace\\images/";
<<<<<<< HEAD
=======
	
	//채연 노트북 이미지 저장
	// public static final String FILE_UPLOAD_PATH = "C:\\Users\\mouse\\OneDrive\\바탕 화면\\대학교\\3-2\\p-project\\bookVilage_clone\\backend\\project_workspace\\images/";
>>>>>>> suhyun-back
	
	// input: File 원본, userLoginId(폴더명)		output: 이미지 경로
	public List<String> saveFile(String loginId, List<MultipartFile> files) {
		String directoryName = loginId + "_" + System.currentTimeMillis();
		String filePath = FILE_UPLOAD_PATH + directoryName;
		
		File directory = new File(filePath);
		
		if (directory.mkdir() == false) {
			return null;
		}
		
		List<String> images = new ArrayList<>();
		
		try {
			for (MultipartFile file : files) {
				byte[] btyes = file.getBytes();
				Path path = Paths.get(filePath + "/" + file.getOriginalFilename());
				Files.write(path, btyes); // 파일 업로드
				images.add("/images/" + directoryName + "/" + file.getOriginalFilename());
			}
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		
		// http://localhost/images/aaaa_1234354/gg.png
		return images;
	}
	
	// input: imgPath 	output: X
	public void deleteFile(List<String> imagePaths) {
		for (String imagePath : imagePaths) {
			Path path = Paths.get(FILE_UPLOAD_PATH + imagePath.replace("/images/", ""));
			
			// 삭제할 이미지 존재?
			if (Files.exists(path)) {
				try {
					Files.delete(path);
				} catch (IOException e) {
					log.info("[파일 매니저 삭제] 이미지 삭제 실패. path():{}", path );
					return;
				}
				
			}
		}

		// 폴더 지우기
		Path paths = Paths.get(FILE_UPLOAD_PATH + imagePaths.get(0).replace("/images/", "")).getParent();
		if (Files.exists(paths)) {
			try {
				Files.delete(paths);
			} catch (IOException e) {
				log.info("[파일 매니저 삭제] 이미지 삭제 실패. paths():{}", paths );
				return;
			}
		}
	}
	
}
