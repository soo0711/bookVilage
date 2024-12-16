import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Profile.css';

const Profile = ({ handleLogout }) => {
  const navigate = useNavigate();
<<<<<<< HEAD
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
=======
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const { userId } = useParams(); // URL에서 userId 가져오기
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [exchangeableBooks, setExchangeableBooks] = useState([]); // 교환 가능한 책
  const [completedExchanges, setCompletedExchanges] = useState([]); // 교환 완료한 책
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [myId, setMyId] = useState(null); // myId 상태 추가
  const [wishlist, setWishlist] = useState([]); // 위시리스트 상태 추가

  const handleImageClick = (book) => {
    // ISBN을 이용해 해당 책의 상세 페이지로 이동
    navigate(`/book/${book.isbn13}`);
  };

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
          const myId = response.data.myId;
          setMyId(myId); // myId 상태 업데이트
          // 데이터 필터링
          const exchangeable = userData.bookCardList.filter(
            (book) => book.bookRegister.status === "교환 가능"
          );
          const completed = userData.bookCardList.filter(
            (book) => book.bookRegister.status === "교환 완료"
          );

          setExchangeableBooks(exchangeable);
          setCompletedExchanges(completed);

          // 위시리스트 데이터 추가
          const wishList = response.data.wishList || [];
          setWishlist(wishList);
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

  const handleChatClick = async () => {
    try {
      // 백엔드로 chatRoomId 요청
      const response = await axios.post(
        "http://localhost:80/chat/room", 
        { fromUserId: userId },  // 상대방 userId를 포함한 요청
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 쿠키 전송 허용
        }
      );
  
      if (response.data.code === 200) {
        const chatRoomId = response.data.chatRoomId;

        // 채팅방으로 이동하고, 채팅 기록을 state로 전달
        navigate(`/chat/${chatRoomId}`, {
          state: {
            targetUser: userId, // 상대방 userId
            chatroomId: chatRoomId, // 채팅방 ID
            myId: myId,  // myId를 state에 추가로 전달
          },
        });
      } else {
        alert("채팅방 생성에 실패했습니다.");
>>>>>>> suhyun-back
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
<<<<<<< HEAD
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
=======
    <>
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
      />
        
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-info">
            <h2>{userInfo?.user?.loginId}님의 프로필</h2>
            {/* loginId 표시 */}
>>>>>>> suhyun-back
          </div>
        </div>

<<<<<<< HEAD
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
=======
        <div className="books-section">
          {/* 교환 가능한 책 섹션 */}
          <div className="exchangeable-books">
            <h3>교환 가능한 책</h3>
            {exchangeableBooks.length > 0 ? (
              <div className="book-grid-profile">
                {exchangeableBooks.map(({ book, bookRegister }) => (
                  <div key={bookRegister.id} className="book-card-pro">
                    <img src={book.cover} alt={book.title} onClick={() => handleImageClick(book)} />
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
              <div className="book-grid-profile">
                {completedExchanges.map(({ book, bookRegister }) => (
                  <div key={bookRegister.id} className="book-card-pro completed">
                    <img src={book.cover} alt={book.title} onClick={() => handleImageClick(book)}/>
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
>>>>>>> suhyun-back
          </div>

          {/* 위시리스트 섹션 */}
          <div className="wishlist-section">
            <h3>위시리스트</h3>
            {wishlist.length > 0 ? (
              <div className="book-grid-profile">
                {wishlist.map(({ book }) => (
                  <div key={book.isbn13} className="book-card-pro wishlist-card-pro">
                    <img src={book.cover} alt={book.title} onClick={() => handleImageClick(book)}/>
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                      <p className="publisher">{book.publisher}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>위시리스트에 추가된 책이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
