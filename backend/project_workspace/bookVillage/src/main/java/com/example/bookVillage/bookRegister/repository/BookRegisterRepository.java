package com.example.bookVillage.bookRegister.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookVillage.bookRegister.entity.BookRegisterEntity;

public interface BookRegisterRepository extends JpaRepository<BookRegisterEntity, Integer>{

	public BookRegisterEntity getByIdAndUserId(int bookRegister, int userId);
	
	
	public BookRegisterEntity getByUserIdAndIsbn13(int userId, String isbn13);


	public List<BookRegisterEntity> findByUserId(Integer userId);
	
	public List<BookRegisterEntity> findByIsbn13(String isbn13);
	
	public List<BookRegisterEntity> findByIsbn13AndUserIdNot(String isbn13, int userId);
	
	@Query(value="select round(avg(point),1) as avg , isbn13 from book_register group by isbn13 order by avg desc limit 5", nativeQuery=true)
	public List<Object[]> findBookAvgPoint();
}
