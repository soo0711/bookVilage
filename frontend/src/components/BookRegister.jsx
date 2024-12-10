import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './MyPage.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const MyPage = ({ isLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('manage-books');

  
  // 로그인 체크를 useEffect로 처리
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user/sign-in-view');
    }
  }, [isLoggedIn, navigate]);

  // 로그인되지 않은 상태면 렌더링하지 않음
  if (!isLoggedIn) {
    return null;
  }

  

  const renderContent = () => {
    switch (activeMenu) {
      case 'manage-books':
        return <ManageBooks />;
      case 'edit-profile':
        return <EditProfile />;
        case 'schedule':
          return <Schedule />;
      default:
        return <ManageBooks />;
    }
  };

  const handleBookRegisterClick = () => {
    navigate('/book-register');
  };

  
  const Schedule = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([
      {
        id: 1,
        title: "Clean Code 교환 약속",
        date: "2024-12-10",
        type: "exchange",
        location: "강남역 카페",
        time: "14:00"
      },
      {
        id: 2,
        title: "독서모임 - 객체지향의 사실과 오해",
        date: "2024-12-11",
        type: "bookclub",
        location: "역삼동 스터디카페",
        time: "19:00"
      }
    ]);

    const getEventsForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return events.filter(event => event.date === dateStr);
    };

    const handleAddEvent = () => {
      const newEvent = {
        id: events.length + 1,
        title: prompt("이벤트 제목을 입력하세요:"),
        date: date.toISOString().split('T')[0],
        type: prompt("이벤트 유형을 입력하세요 (exchange/bookclub):"),
        location: prompt("이벤트 장소를 입력하세요:"),
        time: prompt("이벤트 시간을 입력하세요 (예: 14:00):")
      };
      setEvents([...events, newEvent]);
    };

    const handleEditEvent = (eventId) => {
      const eventToEdit = events.find(event => event.id === eventId);
      if (eventToEdit) {
        const updatedEvent = {
          ...eventToEdit,
          title: prompt("일정 제목을 수정하세요:", eventToEdit.title),
          type: prompt("일정 유형을 수정하세요 (exchange/bookclub):", eventToEdit.type),
          location: prompt("일정 장소를 수정하세요:", eventToEdit.location),
          time: prompt("일정 시간을 수정하세요 (예: 14:00):", eventToEdit.time)
        };
        setEvents(events.map(event => event.id === eventId ? updatedEvent : event));
      }
    };

    const handleDeleteEvent = (eventId) => {
      if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
        setEvents(events.filter(event => event.id !== eventId));
      }
    };

    const tileContent = ({ date, view }) => {
      if (view === 'month') {
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
              {getEventsForDate(date).map(event => (
                <div key={event.id} className={`event-item ${event.type}`}>
                  <h5>{event.title}</h5>
                  <p>시간: {event.time}</p>
                  <p>장소: {event.location}</p>
                  <button onClick={() => handleEditEvent(event.id)}>수정</button>
                  <button onClick={() => handleDeleteEvent(event.id)}>삭제</button>
                </div>
              ))}
            </div>
            <button onClick={handleAddEvent} className="add-event-btn">
              일정 추가
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        onLogout={handleLogout}
      />
      <div className="mypage-container">
        <div className="mypage-sidebar">
          <h2>{username}님의 마이페이지</h2>
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
    const [books, setBooks] = useState([
      {
        id: 1,
        userId: 123,
        title: "Clean Code",
        review: "좋은 책이에요",
        point: "5",
        condition: "A",
        description: "책 상태 매우 좋음",
        exchange_YN: "Y",
        place: "서울시 강남구",
        status: "available",
        createdAt: "2024-03-21 12:00:00",
        updatedAt: "2024-03-21 12:00:00",
        isEditing: false
      },
      // 더미 데이터...
    ]);
  
    const handleEditClick = (bookId) => {
      setBooks(books.map(book => 
        book.id === bookId 
          ? { ...book, isEditing: !book.isEditing }
          : book
      ));
    };
  
    const handleSaveClick = async (bookId) => {
      try {
        // TODO: API 연동 시 실제 서버 요청 추가
        setBooks(books.map(book => 
          book.id === bookId 
            ? { ...book, isEditing: false }
            : book
        ));
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
          // TODO: API 연동 시 실제 서버 요청 추가
          setBooks(books.filter(book => book.id !== bookId));
          alert("삭제가 완료되었습니다.");
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
                <td>
                  {book.isEditing ? (
                    <input
                      type="text"
                      value={book.title}
                      onChange={(e) => handleChange(book.id, 'title', e.target.value)}
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td>
                  {book.isEditing ? (
                    <select
                      value={book.point}
                      onChange={(e) => handleChange(book.id, 'point', e.target.value)}
                    >
                      {[5,4,3,2,1].map(num => (
                        <option key={num} value={num}>{num}점</option>
                      ))}
                    </select>
                  ) : (
                    `${book.point}점`
                  )}
                </td>
                <td>
                  {book.isEditing ? (
                    <select
                      value={book.condition}
                      onChange={(e) => handleChange(book.id, 'condition', e.target.value)}
                    >
                      <option value="A">상태 좋음</option>
                      <option value="B">상태 보통</option>
                      <option value="C">상태 좋지 않음</option>
                    </select>
                  ) : (
                    book.condition === 'A' ? '상태 좋음' : 
                    book.condition === 'B' ? '상태 보통' : 
                    '상태 좋지 않음'
                  )}
                </td>
               
<td>
  {book.isEditing ? (
    <select
      value={book.exchange_YN}
      onChange={(e) => handleChange(book.id, 'exchange_YN', e.target.value)}
    >
      <option value="Y">교환 가능</option>
      <option value="P">교환 예정</option>
      <option value="N">교환 불가</option>
    </select>
  ) : (
    book.exchange_YN === 'Y' ? '교환 가능' : 
    book.exchange_YN === 'P' ? '교환 예정' : 
    '교환 불가'
  )}
</td>
                <td>
                  {book.isEditing ? (
                    <input
                      type="text"
                      value={book.place}
                      onChange={(e) => handleChange(book.id, 'place', e.target.value)}
                    />
                  ) : (
                    book.place
                  )}
                </td>
                <td>
                  {book.status === 'available' ? '교환 가능' : 
                   book.status === 'exchanging' ? '교환 중' : '교환 완료'}
                </td>
                <td>{new Date(book.createdAt).toLocaleDateString()}</td>
                <td>
                  {book.isEditing ? (
                    <button 
                      className="save-btn"
                      onClick={() => handleSaveClick(book.id)}
                    >
                      저장
                    </button>
                  ) : (
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditClick(book.id)}
                    >
                      수정
                    </button>
                  )}
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
    const navigate = useNavigate(); // useNavigate 훅 추가
  
    const handleWithdrawal = (e) => {
      e.preventDefault();
      if (window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        try {
          // TODO: API 연    시 실제 회원탈퇴 요청 추가
          alert("회원탈퇴가 완료되었습니다.");
          navigate('/'); // 홈페이지로 이동
        } catch (error) {
          console.error("회원탈퇴 중 오류 발생:", error);
          alert("회원탈퇴 중 오류가 발생했습니다.");
        }
      }
    };
  
    return (
      <div className="edit-profile">
        <h3>개인 정보 수정</h3>
        <form className="profile-form">
          <div className="form-group">
            <label>아이디</label>
            <input type="text" value="user123" disabled />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" value="user@example.com" disabled />
          </div>
          <div className="form-group">
            <label>이름</label>
            <input type="text" placeholder="이름을 입력하세요" />
          </div>
          <div className="form-group">
            <label>전화번호</label>
            <input 
              type="tel" 
              placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
              pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
            />
          </div>
          <div className="form-group">
            <label>현재 비밀번호</label>
            <input type="password" placeholder="현재 비밀번호" />
          </div>
          <div className="form-group">
            <label>새 비밀번호</label>
            <input type="password" placeholder="새 비밀번호" />
          </div>
          <div className="form-group">
            <label>새 비밀번호 확인</label>
            <input type="password" placeholder="새 비밀번호 확인" />
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

export default MyPage;