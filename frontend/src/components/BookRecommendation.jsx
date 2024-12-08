import React from "react";
import { useLocation } from "react-router-dom";
import "./BookRecommendation.css";
import Header from "./Header";

const BookRecommendation = () => {
  const location = useLocation();
  const { selectedBook, username, recommendedBooks } = location.state || {};
  const isLoggedIn = !!username; // username이 존재하면 로그인 상태로 간주

  return (
    <>
      {/* 헤더 컴포넌트 */}
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={() => console.log("Logout")} />

      <div className="book-recommendation">
        <div className="book-container">
          {selectedBook ? (
            <>
              <div className="user-book">
                <img src={selectedBook.book.cover} alt={selectedBook.book.title} />
                <div className="user-book-title">
                  <h3>{username}님이 선택한 책</h3>
                </div>
                <p>제목: {selectedBook.book.title}</p>
                <p>저자: {selectedBook.book.author}</p>
                <p>평점: {selectedBook.bookRegister.point} / 5</p>
                <p>리뷰: {selectedBook.bookRegister.review}</p>
              </div>
            </>
          ) : (
            <p>선택한 책 정보가 없습니다.</p>
          )}

          <div className="recommended-section">
            <h2>{selectedBook?.book.title}와(과) 비슷한 추천 도서</h2>
            <div className="recommended-container">
              <div className="recommended-books">
                {recommendedBooks.length > 0 ? (
                  recommendedBooks.map((book, index) => (
                    <div key={index} className="book-card">
                      <img src={book.cover} alt={book.title} />
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                    </div>
                  ))
                ) : (
                  <p>추천 도서가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookRecommendation;
