import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  // 임시 데이터
  const userInfo = {
    username: username,
    preferredLocations: ["서울 강남구 역삼동", "서울 서초구 서초동"],
    exchangeableBooks: [
      {
        id: 1,
        title: "해리포터와 마법사의 돌",
        author: "J.K. 롤링",
        condition: "상태 좋음",
        imageUrl: "/book-images/harry1.jpg",
        location: "서울 강남구 역삼동"
      },
      {
        id: 2,
        title: "해리포터와 비밀의 방",
        author: "J.K. 롤링",
        condition: "상태 보통",
        imageUrl: "/book-images/harry2.jpg",
        location: "서울 서초구 서초동"
      }
    ],
    completedExchanges: [
      {
        id: 1,
        title: "반지의 제왕",
        author: "J.R.R. 톨킨",
        exchangeDate: "2024-03-15",
        imageUrl: "/book-images/lotr.jpg",
        location: "서울 강남구 역삼동"
      }
    ]
  };
  const handleChatClick = () => {
    // 채팅방으로 이동하면서 상대방 정보를 state로 전달
    navigate(`/chat/${username}`, {
      state: {
        targetUser: username,
        chatroomId: 1, // 실제로는 서버에서 채팅방 ID를 생성하거나 가져와야 함
      }
    });
  };


  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h2>{username}님의 프로필</h2>
          <div className="preferred-locations">
            <h3>선호하는 교환 장소</h3>
            <ul>
              {userInfo.preferredLocations.map((location, index) => (
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
        <div className="exchangeable-books">
          <h3>교환 가능한 책</h3>
          <div className="book-grid">
            {userInfo.exchangeableBooks.map(book => (
              <div key={book.id} className="book-card-pro">
                <img src={book.imageUrl} alt={book.title} />
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <p className="condition">상태: {book.condition}</p>
                  <p className="location">교환 장소: {book.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="completed-exchanges">
          <h3>교환 완료한 책</h3>
          <div className="book-grid">
            {userInfo.completedExchanges.map(book => (
              <div key={book.id} className="book-card completed">
                <img src={book.imageUrl} alt={book.title} />
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <p className="exchange-date">교환일: {book.exchangeDate}</p>
                  <p className="location">교환 장소: {book.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
