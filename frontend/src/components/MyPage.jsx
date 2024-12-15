import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './MyPage.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from "axios"; // Axios 추가

const MyPage = ({ isLoggedIn: propIsLoggedIn, username, handleLogout}) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('manage-books');
  const [userLoginId, setUserLoginId] = useState(null);
  const [userId, setUserId] = useState(null);

  console.log(userId);

  useEffect(() => {
    // Header와 동일한 API를 호출하여 로그인 상태 확인
    axios.get("http://localhost:80/user/api/user-info", {
      withCredentials: true,
    })
    .then(response => {
      if (response.data.userId && response.data.userLoginId) {
        setIsLoggedIn(true);
        setUserLoginId(response.data.userLoginId);
        setUserId(response.data.userId);
      } else {
        navigate('/user/sign-in-view');
      }
    })
    .catch(error => {
      console.log("사용자 정보 불러오기 실패", error);
      navigate('/user/sign-in-view');
    });
  }, [navigate]);

  // 로그인되지 않은 상태면 로딩 표시
  if (!isLoggedIn) {
    return <div className="loading">로딩 중...</div>;
  }

  


  const renderContent = () => {
    switch (activeMenu) {
      case 'manage-books':
        return <ManageBooks />;
      case 'edit-profile':
        return <EditProfile />;
        case 'schedule':
          return <Schedule />;
      case 'wishlist':
        return <WishList />;
      default:
        return <ManageBooks />;
    }
  };

  const handleBookRegisterClick = () => {
    navigate('/book-register');
  };

  
  const Schedule = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(""); // 추가: 메시지 상태
  
    useEffect(() => {
      const fetchPersonalSchedule = async () => {
        try {
          const response = await axios.post(
            "http://localhost:80/personal-schdule/list",
            {},
            { withCredentials: true }
          );
  
          if (response.data.code === 200) {
            // Combine personal events and hosted events
            const allEvents = [
              ...response.data.data.map(({ personalSchedule, bookMeeting }) => ({
                id: personalSchedule.id,
                title: bookMeeting.subject || "제목 없음",
                content: bookMeeting.content || "내용 없음",
                date: bookMeeting.schedule.split(":")[0].trim().replace(/\./g, "-"),
                time: bookMeeting.schedule.split(":")[1]?.trim() || "시간 미정",
                location: bookMeeting.place || "위치 없음",
                type: "book-meeting",
              })),
              ...response.data.host.map((bookMeeting) => ({
                id: bookMeeting.id,
                title: bookMeeting.subject || "제목 없음",
                content: bookMeeting.content || "내용 없음",
                date: bookMeeting.schedule.split(":")[0].trim().replace(/\./g, "-"),
                time: bookMeeting.schedule.split(":")[1]?.trim() || "시간 미정",
                location: bookMeeting.place || "위치 없음",
                type: "hosted-book-meeting",
              })),
            ];
            setEvents(allEvents);
          } else if (response.data.code === 204) {
            setMessage("참여한 독서 모임이 없습니다.");
          } else {
            alert("일정 데이터를 가져오는 데 실패했습니다.");
          }
        } catch (error) {
          console.error("일정 데이터 로드 중 오류:", error);
          alert("일정 데이터를 가져오는 중 문제가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchPersonalSchedule();
    }, []);

  
  
    const handleDeleteEvent = async (eventId) => {
      if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
        try {
          // POST 요청으로 eventId 전달
          const response = await axios.post(
            `http://localhost:80/personal-schdule/delete`,
            { eventId }, // 요청 본문에 eventId 포함
            { withCredentials: true }
          );
    
          if (response.data.code === 200) {
            setEvents(events.filter(event => event.id !== eventId));
            alert("일정이 삭제되었습니다.");
          } else {
            alert("일정 삭제에 실패했습니다. " + (response.data.error_message || ""));
          }
        } catch (error) {
          console.error("일정 삭제 중 오류:", error);
          alert("일정 삭제 중 문제가 발생했습니다.");
        }
      }
    };
    
  
    const getEventsForDate = (date) => {
      const dateStr = date.toISOString().split("T")[0];
      return events.filter(event => event.date === dateStr);
    };
  
    const tileContent = ({ date, view }) => {
      if (view === "month") {
        const dayEvents = getEventsForDate(date);
        return dayEvents.length > 0 ? (
          <div className="event-dot-container">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`event-dot ${event.type}`}
                title={event.title}
              />
            ))}
          </div>
        ) : null;
      }
    };
  
    const tileClassName = ({ date, view }) => {
      if (view === 'month') {
        const dayEvents = getEventsForDate(date);
        return dayEvents.length > 0 ? 'react-calendar__tile--hasEvents' : null;
      }
    };

    return (
      <div className="schedule">
        <h3>개인 일정</h3>
        <div className="schedule-container">
          <div className="calendar-section">
            <Calendar
              onChange={setDate}
              value={date}
              tileContent={tileContent}
              tileClassName={tileClassName}
              locale="ko-KR"
            />
          </div>
          <div className="events-section">
            <h4>{date.toLocaleDateString()} 일정</h4>
            <div className="events-list">
              {getEventsForDate(date).map((event) => (
                <div key={event.id} className={`event-item ${event.type}`}>
                  <h5>{event.title}</h5>
                  <p>내용: {event.content}</p>
                  <p>시간: {event.time} 시</p>
                  <p>장소: {event.location}</p>
                  <button onClick={() => handleDeleteEvent(event.id)}>삭제</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn} 
        username={userLoginId} 
        onLogout={handleLogout}
      />
      <div className="mypage-container">
        <div className="mypage-sidebar">
          <h2>{userLoginId}님의 마이페이지</h2> {/* userId => name으로 바꿔야함*/}
          <nav className="mypage-nav">
            <button onClick={handleBookRegisterClick}>
              책 등록
            </button>
            <button 
              className={activeMenu === 'manage-books' ? 'active' : ''} 
              onClick={() => setActiveMenu('manage-books')}
            >
              등록한 책 관리
            </button>
            <button 
              className={activeMenu === 'edit-profile' ? 'active' : ''} 
              onClick={() => setActiveMenu('edit-profile')}
            >
              개인 정보 수정
            </button>
            <button 
              className={activeMenu === 'schedule' ? 'active' : ''} 
              onClick={() => setActiveMenu('schedule')}
            >
              개인 일정
            </button>
            <button
            className={activeMenu === 'wishlist' ? 'active' : ''}
            onClick={() => setActiveMenu('wishlist')} >
            위시리스트
          </button>
          </nav>
        </div>
        <div className="mypage-content">
          {renderContent()}
        </div>
      </div>
    </>
  );
};


// ... MyPage 컴포넌트 위에 ManageBooks 컴포넌트 추가
const ManageBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // 실제 API 경로로 수정
        const response = await axios.post("http://localhost:80/book-register/detail-list", {}, {
          withCredentials: true, // 세션을 가져오기 위한 옵션
        });
  
        if (response.data.result === "성공") {
          setBooks(response.data.bookRegisterList);
        } else {
          alert("책 목록을 가져오는 데 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("책 목록을 가져오는 중 오류 발생:", error);
        alert("책 목록을 가져오는 데 오류가 발생했습니다.");
      }
    };
  
    fetchBooks(); // 컴포넌트가 마운트되면 API 호출
  }, []); // 의존성 배열이 빈 배열이므로 한 번만 호출됨

  const handleSaveClick = async (bookId) => {
    try {
      // TODO: API 연동 시 실제 서버 요청 추가
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (bookId, field, value) => {
    setBooks(books.map(book => 
      book.id === bookId 
        ? { ...book, [field]: value }
        : book
    ));
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("정말로 이 책을 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(
          "http://localhost:80/book-register/delete",
          {
            data: { bookRegisterId: bookId },  // 'data' 키를 사용해야 합니다.
            withCredentials: true
          }
        );
        if (response.data.code === 200) {
          setBooks(books.filter(book => book.id !== bookId));
          alert("삭제가 완료되었습니다.");
        }
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="manage-books">
      <h3>등록한 책 관리</h3>
      <table>
        <thead>
          <tr>
            <th>책 제목</th>
            <th>평점</th>
            <th>책 상태</th>
            <th>교환 여부</th>
            <th>교환 장소</th>
            <th>교환 상태</th>
            <th>등록일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{`${book.point}점`}</td>
              <td>{
                book.b_condition === 'A' ? '상태 좋음' : 
                book.b_condition === 'B' ? '상태 보통' : 
                book.b_condition === 'C' ? '상태 좋지 않음' : 
                ''
              }</td>
              <td>{
                book.exchange_YN === 'Y' ? '교환 가능' :  '교환 불가'
              }</td>
              <td>{book.place}</td>
              <td>{
                book.status === '교환 가능' ? '교환 가능' : 
                book.status === '교환 완료' ? '교환 완료' : 
                book.status === '교환 불가' ? '교환 불가' : '교환 중'
              }</td>
              <td>{new Date(book.createdAt).toLocaleDateString()}</td>
              <td>
                <button 
                  className="edit-btn"
                  onClick={() => navigate('/book/update', { state: { bookId: book.id } })}
                >
                  수정
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(book.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

  // ... MyPage 컴포넌트는 그대로 유지 ...

// EditProfile 컴포넌트 수정
const EditProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    loginId: "",
    email: "",
    name: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // 사용자 정보 불러오기
    axios.post("http://localhost:80/user/myPage", {}, { withCredentials: true })
      .then(response => {
        if (response.data.code === 200 && response.data.userEntity) {
          const user = response.data.userEntity;
          setUserInfo({
            loginId: user.loginId,
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
          });
        } else {
          console.error("사용자 인증 실패:", response.data.error_message);
          navigate('/user/sign-in-view'); // 로그인 페이지로 이동
        }
      })
      .catch(error => {
        console.error("사용자 정보 불러오기 실패:", error);
        navigate('/user/sign-in-view');
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // 사용자 정보 수정 API 호출
    axios.post("http://localhost:80/user/update", userInfo, { withCredentials: true })
      .then(response => {
        if (response.data.code === 200) {
          alert("정보 수정이 완료되었습니다.");
        } else {
          alert("정보 수정에 실패하였습니다.");
        }
      })
      .catch(error => {
        console.error("정보 수정 중 오류 발생:", error);
        alert("정보 수정 중 오류가 발생했습니다.");
      });
  };

  const handleWithdrawal = (e) => {
    e.preventDefault();
    if (window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      axios.delete("http://localhost:80/user/delete", { withCredentials: true })
        .then(() => {
          alert("회원탈퇴가 완료되었습니다.");
          navigate('/'); // 홈페이지로 이동
        })
        .catch(error => {
          console.error("회원탈퇴 중 오류 발생:", error);
          alert("회원탈퇴 중 오류가 발생했습니다.");
        });
    }
  };

  return (
    <div className="edit-profile">
      <h3>개인 정보 수정</h3>
      <form className="profile-form" onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>아이디</label>
          <input type="text" value={userInfo.loginId} disabled />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>전화번호</label>
          <input
            type="tel"
            name="phoneNumber"
            value={userInfo.phoneNumber}
            onChange={handleInputChange}
            pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
          />
        </div>
        <button type="submit" className="submit-btn">정보 수정</button>
        <button
          type="button"
          className="withdrawal-link"
          onClick={handleWithdrawal}
        >
          회원 탈퇴
        </button>
      </form>
    </div>
  );
};

// EditProfile 컴포넌트 수정

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 위시리스트 데이터를 가져오는 API 호출
    const fetchWishlist = async () => {
      try {
        const response = await axios.post('http://localhost:80/wishList/mypage-list', {}, {
          withCredentials: true
        });

        const data = response.data; // axios는 JSON 데이터를 자동으로 파싱

        if (data.code === 200) {
          setWishlistItems(data.date); // 서버에서 받은 위시리스트 데이터 설정
        } else {
          setWishlistItems([]); // 위시리스트가 없을 경우 빈 배열 설정
        }
      } catch (error) {
        console.error('위시리스트를 가져오는 중 오류 발생:', error);
        setWishlistItems([]); // 오류 발생 시 빈 배열 설정
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveWishlist = async (isbn13) => {
    try {
      const response = await axios.post(
        'http://localhost:80/wishList/delete',
        { isbn13 }, // 요청 데이터
        { withCredentials: true }
      );

      if (response.data.code === 200) {
        // 삭제 성공 시 메시지 표시 및 새로고침
        alert('찜 취소가가 완료되었습니다.');
        window.location.reload(); // 새로고침
      } else {
        alert(response.data.error_message || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('삭제 요청 중 오류 발생:', error);
      alert('삭제 요청 중 오류가 발생했습니다.');
    }
  };

  const handleImageClickExchange = (item) => {
    navigate(`/book/${item.book.isbn13}`);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-empty">
        <h3>위시리스트</h3>
        <p>아직 찜한 책이 없습니다.</p>
        <p>마음에 드는 책을 찜해보세요!</p>
      </div>
    );
  }

  return (
    <div className="wishlist2-container">
      <h3>위시리스트</h3>
      <div className="books-grid-wishlist">
      {wishlistItems.map((item) => (
      <div key={item.book.isbn13} className="book-card-wishlist">
        <div className="book-wishlist-cover">
          <img
            src={item.book.cover}
            alt={item.book.title}
            onClick={() => handleImageClickExchange(item)}
            onError={(e) => (e.target.src = '/default-cover.jpg')} // 이미지 로딩 실패 시 대체 이미지
          />
        </div>
        <div className="book-info">
          <h4>{item.book.title}</h4>
          <p>{item.book.author}</p>
          <p>{item.book.publisher}</p>
          <p className="added-date">
            찜한 날짜: {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          className="remove-wishlist"
          onClick={() => handleRemoveWishlist(item.book.isbn13)}
        >
          찜 취소
        </button>
      </div>
        ))}
      </div>
    </div>
  );
};
export default MyPage;