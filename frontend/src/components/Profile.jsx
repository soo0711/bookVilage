import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import Header from "./Header";
import axios from "axios";

const Profile = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const { userId } = useParams(); // URL에서 userId 가져오기
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [exchangeableBooks, setExchangeableBooks] = useState([]); // 교환 가능한 책
  const [completedExchanges, setCompletedExchanges] = useState([]); // 교환 완료한 책
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
  }, [userId]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.post(
          "http://localhost:80/user-book/user-profile",
          { userId }, // userId를 요청 본문에 포함
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // 쿠키 전송 허용
          }
        );

        if (response.data.code === 200) {
          const userData = response.data.data || {};
          setUserInfo(userData);

          // 데이터 필터링
          const exchangeable = userData.bookCardList.filter(
            (book) => book.bookRegister.stauts === "교환 가능"
          );
          const completed = userData.bookCardList.filter(
            (book) => book.bookRegister.stauts === "교환 완료"
          );

          setExchangeableBooks(exchangeable);
          setCompletedExchanges(completed);
        } else {
          setError("사용자 정보를 불러오는 데 문제가 발생했습니다.");
        }
      } catch (err) {
        setError("서버 요청 중 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleChatClick = () => {
    navigate(`/chat/${userId}`, {
      state: {
        targetUser: userId,
        chatroomId: 1, // 실제 서버에서 채팅방 ID를 생성하거나 가져와야 함
      },
    });
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        />
        
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <h2>{userInfo?.loginId}님의 프로필</h2>
            {/* loginId 표시 */}
            <div className="preferred-locations">
              <h3>선호하는 교환 장소</h3>
              <ul>
                {userInfo?.preferredLocations?.map((location, index) => (
                  <li key={index}>{location}</li>
                ))}
              </ul>
            </div>
          </div>
          <button className="chat-button" onClick={handleChatClick}>
            채팅하기
          </button>
        </div>

        <div className="books-section">
          {/* 교환 가능한 책 섹션 */}
          <div className="exchangeable-books">
            <h3>교환 가능한 책</h3>
            {exchangeableBooks.length > 0 ? (
              <div className="book-grid">
                {exchangeableBooks.map(({ book, bookRegister }) => (
                  <div key={bookRegister.id} className="book-card-pro">
                    <img src={book.cover} alt={book.title} />
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                      <p className="condition">상태: {bookRegister.b_condition}</p>
                      <p className="location">교환 장소: {bookRegister.place}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>교환 가능한 책이 없습니다.</p>
            )}
          </div>

          {/* 교환 완료한 책 섹션 */}
          <div className="completed-exchanges">
            <h3>교환 완료한 책</h3>
            {completedExchanges.length > 0 ? (
              <div className="book-grid">
                {completedExchanges.map(({ book, bookRegister }) => (
                  <div key={bookRegister.id} className="book-card completed">
                    <img src={book.cover} alt={book.title} />
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                      <p className="exchange-date">등록일: {new Date(bookRegister.createdAt).toLocaleDateString()}</p>
                      <p className="location">교환 장소: {bookRegister.place}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>교환 완료된 책이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
