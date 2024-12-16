import React from "react";
import "./BookRecommendation.css";
import { useNavigate } from 'react-router-dom';

const BookRecommendation = ({ userBooks, username }) => {
  const navigate = useNavigate();

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

  const handleExchangeClick = (book) => {
    navigate(`/exchange-list/${book.id}`, {
      state: {
        book: {
          id: book.id,
          title: book.title,
          image: book.image,
          rating: book.rating || 4.2
        },
        exchangeUsers: [
          {
            username: "김채연",
            location: "서울시 강서구"
          },
          {
            username: "전수현",
            location: "서울시 강동구"
          },
          {
            username: "조희언",
            location: "서울시 강동구"
          }
        ]
      }
    });
  };

<<<<<<< HEAD
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
          <h2>{userBooks[0]?.title} 와(과) 비슷한 책</h2>
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
                  <button onClick={() => handleExchangeClick(book)}>교환 가능 리스트</button>
                </div>
              ))}
=======
  const handleImageClick = () => {
    // ISBN을 이용해 해당 책의 상세 페이지로 이동
    navigate(`/book/${selectedBook.book.isbn13}`);
  };

  const handleImageClickExchange = (book) => {
    navigate(`/book/${book.isbn13}`);
  };

  return (
    <>
      {/* 헤더 컴포넌트 */}
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />
      <div className="book-recommendation">
        <div className="book-containerr">
          {selectedBook ? (
            <>
              <div className="user-bookr">
                <img src={selectedBook.book.cover} alt={selectedBook.book.title} onClick={handleImageClick} />
                <div className="user-book-title">
                  <h3>{displayUsername}님이 선택한 책</h3>
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
            <div className="recommended-containerr">
              <div className="recommended-bookr">
                {recommendedBooks.length > 0 ? (
                  recommendedBooks.map((book, index) => (
                    <div key={index} className="book-cardr">
                      <img src={book.cover} onClick={() => handleImageClickExchange(book)}  alt={book.title} />
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                      {/* 교환 리스트 버튼 추가 */}
                      <button onClick={() => handleExchangeClick(book)} className="book-exchange">
                        교환 리스트 보기
                      </button>
                    </div>
                  ))
                ) : (
                  <p>추천 도서가 없습니다.</p>
                )}
              </div>
>>>>>>> suhyun-back
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
