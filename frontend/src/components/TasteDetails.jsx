import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TasteDetails.css";
import Header from "./Header";

const TasteDeatils = ({ handleLogout, username, isLoggedIn }) => {
  const location = useLocation();
  const { selectedBook, recommendedBooks = [], username: locationUsername } = location.state || {}; // recommendedBooks에 기본값 설정
  console.log(recommendedBooks);
  // `username`을 사용하려면, `locationUsername`이 없을 때는 `props`에서 받은 `username`을 사용하도록 처리
  const displayUsername = locationUsername || username;

  const navigate = useNavigate();

  // 교환 리스트 페이지로 이동
  const handleExchangeClick = (book) => {
    navigate(`/exchange-list/${book.isbn13}`, {
      state: {
        book: book,  // 클릭한 추천 도서 정보를 전달
      }
    });
  };

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
            <h2 className="section-titles">나의 취향에 맞는 책 추천</h2>
          <div className="recommended-section">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TasteDeatils;
