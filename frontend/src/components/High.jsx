import React, { useState, useEffect } from "react";
import axios from "axios";
import "./High.css";

const High = () => {
  const [books, setBooks] = useState([]); // 초기 상태는 빈 배열

  useEffect(() => {
    // API 호출
    axios
      .get("http://localhost:80/user-book/point-list") // 실제 API URL로 변경
      .then((response) => {
        if (response.data.code === 200) {
          // 서버에서 받은 데이터에서 'bookCardList'를 books 상태로 설정
          setBooks(response.data.bookCardList);
        }
      })
      .catch((error) => {
        console.error("API 호출 실패:", error);
      });
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  return (
    <section className="high-books">
      <div className="left-section">
        <h2 className="section-title">평균별점이 높은 작품</h2>
      </div>
      <div className="right-section">
        <div className="books-list">
          {books.map((bookCard) => (
            <div className="book-card-high" key={bookCard.book.isbn13}>
              <img
                src={bookCard.book.cover}
                alt={bookCard.book.title}
                className="book-image"
              />
              <h3 className="book-title">{bookCard.book.title}</h3>
              <p className="book-rating">평균 ★ {bookCard.bookRegister.point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default High;