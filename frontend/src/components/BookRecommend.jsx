import React, { useState, useEffect } from "react";
import Header from "./Header";
import BookRegisterForm from "./BookRegister";
import BookRecommendation from "./BookRecommendation";

const BookRecommend = () => {
  const [isBookRegistered, setIsBookRegistered] = useState(false); // 책 등록 여부
  const [userBooks, setUserBooks] = useState([]); // 등록된 책 리스트
  const [recommendedBooks, setRecommendedBooks] = useState([]); // 추천 책 리스트

  // 책 등록 핸들러
  const handleBookRegister = (book) => {
    setUserBooks([...userBooks, book]);
    setIsBookRegistered(true);
  };

  // 추천 책 가져오기 (알라딘 API 사용)
  const fetchRecommendedBooks = async () => {
    if (userBooks.length > 0) {
      try {
        // 알라딘 API 호출 (대체 URL 예시)
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
