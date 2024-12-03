import React from "react";
import "./BookRecommendation.css";

const BookRecommendation = ({ userBooks, username }) => {
  // 임시 추천 도서 데이터
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

  return (
    <div className="book-recommendation">
      <div className="book-container">
        <div className="user-book">
          <img src={userBooks[0]?.imageUrl} alt={userBooks[0]?.title} />
          <div className="user-book-title">
            <img 
              src="/assets/imo.png" 
              alt="이모지" 
              style={{ width: '20px', height: '20px' }}  // 크기 조절
            />
            <h3>{username}님이 읽은 책</h3>
          </div>
          <p>{userBooks[0]?.title}</p>
        </div>
        
        <div className="recommended-section">
          <h2>{userBooks[0]?.title} 와 비슷한 책</h2>
          <div className="recommended-container">
            <button className="slide-button left">
              <img src="/assets/left.png" alt="이전" />
            </button>
            <div className="recommended-books">
              {tempRecommendedBooks.map((book, index) => (
                <div key={index} className="book-card">
                  <img src={book.image} alt={book.title} />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <button>교환 리스트</button>
                </div>
              ))}
            </div>
            <button className="slide-button right">
              <img src="/assets/right.png" alt="다음" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRecommendation;
