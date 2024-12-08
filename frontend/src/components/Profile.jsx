import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css';
import Header from './Header';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams(); // URL에서 username 가져오기
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 데이터 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:80/book-register/list`, {
          params: { username }, // username을 쿼리 파라미터로 전달
          withCredentials: true,
        });

        if (response.data.code === 200) {
          setUserInfo(response.data.data || {}); // 서버에서 받은 사용자 정보 설정
        } else {
          setError('사용자 정보를 불러오는 데 문제가 발생했습니다.');
        }
      } catch (err) {
        setError('서버 요청 중 에러가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [username]);

  const handleChatClick = () => {
    navigate(`/chat/${username}`, {
      state: {
        targetUser: username,
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
      <Header isLoggedIn={true} username={username} onLogout={() => console.log('Logout')} />
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
    </>
  );
};

export default Profile;
