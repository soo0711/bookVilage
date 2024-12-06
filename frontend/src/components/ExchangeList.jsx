import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./ExchangeList.css";
import Header from "./Header";

const ExchangeList = () => {
  const { bookId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // state가 없을 경우의 기본값 설정
  const defaultBook = {
    title: "",
    image: "",
    rating: 0
  };

  const defaultExchangeUsers = [];

  // state가 없을 경우 메인 페이지로 리다이렉트
  if (!state) {
    return (
      <div className="exchange-list-container">
        <h1>잘못된 접근입니다.</h1>
        <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
      </div>
    );
  }

  const { book = defaultBook, exchangeUsers = defaultExchangeUsers } = state;

  return (
    <>
    <Header/>
    <div className="exchange-list-container">
      <h1 className="exchange-list-title">
        {book.title ? `${book.title} 교환 가능 리스트` : "교환 가능 리스트"}
      </h1>
      
      <div className="exchange-list-content">
        <div className="book-info">
          <img 
            src={book.image || "https://via.placeholder.com/150"} 
            alt={book.title || "책 이미지"} 
            className="book-image" 
          />
          <div className="book-details">
            <h2>{book.title || "제목 없음"}</h2>
            <div className="book-rating">
              <span className="star">★</span>
              <span>{book.rating || 0}</span>
            </div>
          </div>
        </div>

        <div className="exchange-users-list">
          {exchangeUsers.length > 0 ? (
            exchangeUsers.map((user, index) => (
              <div key={index} className="exchange-user-item">
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <p className="exchange-location">교환 가능 장소: {user.location}</p>
                </div>
                <button className="chat-button">채팅하기</button>
              </div>
            ))
          ) : (
            <p>교환 가능한 사용자가 없습니다.</p>
          )}
        </div>
      </div>
      <div className="back-button-container">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            이전 목록
          </button>
        </div>
    </div>

    </>
  );
};

export default ExchangeList;
