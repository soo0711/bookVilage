import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./BookMeeting.css";

const BookMeeting = ({ isLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetings, setMeetings] = useState([
    // 더미 데이터 추가
    {
      id: 1,
      hostLoginid: "book_lover",
      schedule: "2024.03.25 : 18시",
      title: "3월 북클럽 - 데미안 함께 읽기",
      place: "강남역 스터디카페",
      closeYN: "N",
      total: 5,
      createdAt: "2024-03-20T10:00:00",
      updatedAt: "2024-03-20T10:00:00"
    },
    {
      id: 2,
      hostLoginid: "reader123",
      schedule: "2024.03.26 : 19시",
      title: "3월 북클럽 - 데미안 함께 읽기",
      place: "zoom 온라인",
      closeYN: "N",
      total: 8,
      createdAt: "2024-03-20T11:30:00",
      updatedAt: "2024-03-20T11:30:00"
    },
    {
      id: 3,
      hostLoginid: "bookclub",
      schedule: "2024.03.27 : 20시",
      title: "3월 북클럽 - 데미안 함께 읽기",
      place: "신논현역 카페",
      closeYN: "Y",
      total: 4,
      createdAt: "2024-03-20T14:20:00",
      updatedAt: "2024-03-20T14:20:00"
    }
  ]);
  const [isWriting, setIsWriting] = useState(false);
  const [formData, setFormData] = useState({
    hostLoginid: username,
    schedule: "",
    place: "",
    total: "",
    closeYN: "N"
  });

  // 독서모임 목록 조회
  /*
  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch("/bookMeeting/list", {
        method: "GET",
        credentials: 'include'
      });
      const data = await response.json();
      if (data.code === 200) {
        setMeetings(data.result);
      }
    } catch (error) {
      console.error("독서모임 목록 조회 실패:", error);
    }
  };
  */

  const handleCreate = async (e) => {
    e.preventDefault();
    // 임시 생성 로직
    const newMeeting = {
      id: meetings.length + 1,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMeetings([...meetings, newMeeting]);
    setIsWriting(false);
    setFormData({
      hostLoginid: username,
      schedule: "",
      place: "",
      total: "",
      closeYN: "N"
    });
    alert("독서모임이 생성되었습니다.");

    /* 서버 연동 코드 주석처리
    try {
      const response = await fetch("/bookMeeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.code === 200) {
        alert("독서모임이 생성되었습니다.");
        setIsWriting(false);
        fetchMeetings();
      } else {
        throw new Error(data.error_message);
      }
    } catch (error) {
      alert(`생성 중 오류가 발생했습니다: ${error.message}`);
    }
    */
  };

  const handleJoin = async (meetingId) => {
    // 임시 참가 로직
    setMeetings(meetings.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, closeYN: "Y" }
        : meeting
    ));
    alert("독서모임 참여가 완료되었습니다.");

    /* 서버 연동 코드 주석처리
    try {
      const response = await fetch("/bookMeeting/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ meetingId })
      });
      const data = await response.json();
      if (data.code === 200) {
        alert("독서모임 참여가 완료되었습니다.");
        fetchMeetings();
      } else {
        throw new Error(data.error_message);
      }
    } catch (error) {
      alert(`참여 중 오류가 발생했습니다: ${error.message}`);
    }
    */
  };

  return (
    <>
      <Header 
       isLoggedIn={isLoggedIn}
       username={username}
       onLogout={handleLogout}
     />
     <div className="book-meeting-container">
       <div className="board-header">
         <h2>독서모임</h2>
         {isLoggedIn && (
           <button 
             className="write-button"
             onClick={() => setIsWriting(true)}
           >
             모임 만들기
           </button>
         )}
       </div>
 
       {isWriting ? (
         <div className="meeting-form">
           <h3>독서모임 만들기</h3>
           <form onSubmit={handleCreate}>
             <input
               type="text"
               placeholder="모임 제목"
               value={formData.title}
               onChange={(e) => setFormData({...formData, title: e.target.value})}
               required
             />
             <input
               type="text"
               placeholder="모임 일정 (YYYY.MM.DD : HH시)"
               value={formData.schedule}
               onChange={(e) => setFormData({...formData, schedule: e.target.value})}
               required
             />
             <input
               type="text"
               placeholder="모임 장소 (예: 줌, 신논현역 카페)"
               value={formData.place}
               onChange={(e) => setFormData({...formData, place: e.target.value})}
               required
             />
             <input
               type="number"
               placeholder="모집 인원"
               value={formData.total}
               onChange={(e) => setFormData({...formData, total: e.target.value})}
               required
               min="1"
             />
             <textarea
               placeholder="모임 상세 설명"
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               required
             />
             <div className="form-buttons">
               <button type="submit">등록하기</button>
               <button type="button" onClick={() => setIsWriting(false)}>취소</button>
             </div>
           </form>
         </div>
       ) : selectedMeeting ? (
         <div className="meeting-detail">
           <div className="meeting-detail-header">
             <h3>{selectedMeeting.title}</h3>
             <button className="back-button" onClick={() => setSelectedMeeting(null)}>목록으로</button>
           </div>
           <div className="meeting-detail-content">
             <p className="detail-schedule"><strong>일정:</strong> {selectedMeeting.schedule}</p>
             <p className="detail-place"><strong>장소:</strong> {selectedMeeting.place}</p>
             <p className="detail-host"><strong>주최자:</strong> {selectedMeeting.hostLoginid}</p>
             <p className="detail-total"><strong>모집 인원:</strong> {selectedMeeting.total}명</p>
             <p className="detail-description">{selectedMeeting.description}</p>
             <p className="detail-created-at">개설일: {new Date(selectedMeeting.createdAt).toLocaleDateString()}</p>
           </div>
           {isLoggedIn && selectedMeeting.hostLoginid !== username && (
             <button 
               className={`join-button ${selectedMeeting.closeYN === 'Y' ? 'full' : ''}`}
               onClick={() => handleJoin(selectedMeeting.id)}
               disabled={selectedMeeting.closeYN === 'Y'}
             >
               {selectedMeeting.closeYN === 'Y' ? '마감' : '참가하기'}
             </button>
           )}
         </div>
       ) : (
         <div className="meeting-list">
           {meetings.map(meeting => (
             <div key={meeting.id} className="meeting-item">
               <div className="meeting-info" onClick={() => setSelectedMeeting(meeting)}>
                 <h3 className="meeting-title">{meeting.title}</h3>
                 <p>일정: {meeting.schedule}</p>
                 <p>장소: {meeting.place}</p>
                 <p>주최자: {meeting.hostLoginid}</p>
                 <p>모집 인원: {meeting.total}명</p>
                 <p className="created-at">개설일: {new Date(meeting.createdAt).toLocaleDateString()}</p>
               </div>
               {isLoggedIn && meeting.hostLoginid !== username && (
                 <button 
                   className={`join-button ${meeting.closeYN === 'Y' ? 'full' : ''}`}
                   onClick={(e) => {
                     e.stopPropagation();
                     handleJoin(meeting.id);
                   }}
                   disabled={meeting.closeYN === 'Y'}
                 >
                   {meeting.closeYN === 'Y' ? '마감' : '참가하기'}
                 </button>
               )}
             </div>
           ))}
         </div>
       )}
     </div>
    </>
  );
};

export default BookMeeting;
