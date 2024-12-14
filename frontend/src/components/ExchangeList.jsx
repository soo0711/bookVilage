import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./ExchangeList.css";
import Header from "./Header";
import axios from "axios";

const ExchangeList = () => {
  const { bookId } = useParams(); // URL에서 isbn13 값 받기
  const { state } = useLocation(); // state에서 책 정보 받기
  const navigate = useNavigate();

  const [exchangeUsers, setExchangeUsers] = useState([]); // 교환 가능한 사용자 리스트
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [myId, setMyId] = useState(null); // 내 userId
  const [myData, setMyData] = useState([]); // 내가 등록한 책들
  const defaultBook = {
    title: "",
    cover: "", // 책 이미지로 수정
  };
  const { book = defaultBook } = state || {};

  // 서버에서 데이터를 가져오는 함수
  useEffect(() => {
    const fetchExchangeList = async () => {
      try {
        const response = await axios.post(
          "http://localhost:80/book-register/exchange-list",
          { isbn13: bookId }, // 요청 데이터
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // 쿠키 전송 허용
          }
        );

        const data = response.data;
        if (data.code === 200) {
          setExchangeUsers(data.data); // 성공적으로 리스트 가져오기
          setMyId(data.myId); // myId 상태 업데이트
          setMyData(data.mydata); // 내가 등록한 책들 업데이트
        } else {
          setError("데이터를 불러오는 데 문제가 발생했습니다.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeList();
  }, [bookId]);

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); // userId를 URL 파라미터로 전달
  };

  const handleChatClick = async (targetUserId) => {
    try {
      const response = await axios.post(
        "http://localhost:80/chat/room",
        { fromUserId: targetUserId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 쿠키 전송 허용
        }
      );

      if (response.data.code === 200) {
        const chatRoomId = response.data.chatRoomId;

        navigate(`/chat/${chatRoomId}`, {
          state: {
            targetUser: targetUserId, // 상대방 userId
            chatroomId: chatRoomId, // 채팅방 ID
            myId: myId, // 내 userId
          },
        });
      } else {
        alert("채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 중 에러:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  const getMatchingBooksMessage = (wishList, myData) => {
    const matchingBooks = myData.filter((myBook) =>
      wishList.some((wish) => wish.isbn13 === myBook.isbn13)
    );

    if (matchingBooks.length > 0) {
      const titles = matchingBooks.map((book) => (
        <strong key={book.isbn13}>{book.title}</strong>
      ));
      return (
        <>
          {titles.reduce((prev, curr) => [prev, "과 ", curr])}
          을 회원님이 가지고 있습니다.
        </>
      );
    }

    return null;
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Header />
      <div className="exchange-list-container">
        <h1 className="exchange-list-title">
          {book.title ? `${book.title} 교환 가능 리스트` : "교환 가능 리스트"}
        </h1>

        <div className="exchange-list-content">
          <div className="book-info2">
            <img
              src={book.cover || "https://via.placeholder.com/150"}
              alt={book.title || "책 이미지"}
              className="book-image2"
            />
            <div className="book-details">
              <h2>{book.title || "제목 없음"}</h2>
            </div>
          </div>

          <div className="exchange-users-list">
            {exchangeUsers.length > 0 ? (
              exchangeUsers.map((register) => {
                // 사용자가 원하는 책과 내가 가진 책 비교
                const userWishlist = register.wishList || [];
                const matchedBooks = myData.filter((book) =>
                  userWishlist.some((wish) => wish.isbn13 === book.isbn13)
                );

                return (
                  <div key={register.bookRegister.id} className="exchange-user-item">
                    <div className="user-info-exchangeList">
                      <h3
                        onClick={() => handleUserClick(register.user.id)}
                        className="username-link"
                      >
                        사용자 : {register.user.loginId}
                      </h3>
                      <p className="exchange-location">
                        교환 가능 장소: {register.bookRegister.place}
                      </p>
                      <p className="exchange-description">
                        설명: {register.bookRegister.description}
                      </p>
                      <p className="exchange-condition">
                        상태: {register.bookRegister.b_condition}
                      </p>
                
                      {matchedBooks.length > 0 && (
                        <p className="matched-book-info">
                          {register.user.loginId}님이 원하는 책{" "}
                          {getMatchingBooksMessage(userWishlist, myData)}
                        </p>
                      )}
                    </div>
                    <button
                      className="chat-button"
                      onClick={() => handleChatClick(register.user.id)}
                    >
                      채팅하기
                    </button>
                  </div>
                );
              })
            ) : (
              <p>교환 가능한 사용자가 없습니다.</p>
            )}
          </div>
        </div>
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>이전 목록</button>
        </div>
      </div>
    </>
  );
};

export default ExchangeList;
