import React, { useState, useEffect } from "react";
import Header from "./Header";
import BookRegisterForm from "./BookRegister";
import BookRecommendation from "./BookRecommendation";

const BookRecommend = () => {
  const [isBookRegistered, setIsBookRegistered] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  // 책 등록 핸들러 수정
  const handleBookRegister = (book) => {
    setUserBooks([book]); // 새로운 책으로 배열 업데이트
    setIsBookRegistered(true);
    
    // 임시 추천 도서 데이터 설정
    const tempRecommendedBooks = [
      {
        title: "추천도서 1",
        author: "작가1",
        image: "https://via.placeholder.com/150x200",
      },
      {
        title: "추천도서 2",
        author: "작가2",
        image: "https://via.placeholder.com/150x200",
      },
      {
        title: "추천도서 3",
        author: "작가3",
        image: "https://via.placeholder.com/150x200",
      },
    ];
    setRecommendedBooks(tempRecommendedBooks);
  };

  /* 실제 API 연동 시 사용할 함수
  const fetchRecommendedBooks = async () => {
    if (userBooks.length > 0) {
      try {
        const response = await fetch(
          `https://api.aladin.co.kr/recommend?query=${userBooks[0].title}`
        );
        const data = await response.json();
        setRecommendedBooks(data.books);
      } catch (error) {
        console.error("추천 책을 가져오는 중 오류 발생:", error);
      }
    }
  };

  useEffect(() => {
    if (isBookRegistered) {
      fetchRecommendedBooks();
    }
  }, [userBooks]);
  */

  return (
    <>
      <Header />
      <div className="book-recommend-page">
        {!isBookRegistered ? (
          <BookRegisterForm onRegister={handleBookRegister} />
        ) : (
          <BookRecommendation
            userBooks={userBooks}
            recommendedBooks={recommendedBooks}
            username="사용자" // 임시 사용자 이름
          />
        )}
        <footer className="footer">
          <p>@copyright bookVillage</p>
        </footer>
      </div>
    </>
  );
};

export default BookRecommend;
