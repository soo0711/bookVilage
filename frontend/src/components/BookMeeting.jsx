import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./BookMeeting.css";
import axios from "axios"; //
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 스타일 추가
import { format } from "date-fns";

const BookMeeting = ({ isLoggedIn : propIsLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [userLoginId, setUserLoginId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    hostLoginid: username,
    subject: "",
    content: "",
    schedule: new Date(),
    place: "",
    total: "",
    closeYN: "N",
    sidoCd: "",
    siggCd: "",
    emdongCd: "",
    detailedPlace: "" // 상세주소 추가
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [emdongList, setEmdongList] = useState([]);

  useEffect(() => {
    // 시/도 리스트 가져오기
    const fetchSidoList = async () => {
      try {
        const response = await axios.post("http://localhost:80/region/sido");
        if (response.data.code === 200) {
          setSidoList(response.data.sido);
        } else {
          alert(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching Sido list:", error);
      }
    };
  
    fetchSidoList();
  }, []);
  
  const handleSidoChange = async (e) => {
    const selectedSido = e.target.value;
    setFormData((prev) => ({ ...prev, sidoCd: selectedSido, siggCd: "ALL", emdongCd: "ALL" }));
    
    if (selectedSido !== "ALL") {
      try {
        const response = await axios.post("http://localhost:80/region/sigungu", { sido: selectedSido });
        if (response.data.code === 200) {
          setSigunguList(response.data.sigungu);
        } else {
          alert(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching Sigungu list:", error);
      }
    } else {
      setSigunguList([]);
      setEmdongList([]);
    }
  };
  
  const handleSigunguChange = async (e) => {
    const selectedSigungu = e.target.value;
    setFormData((prev) => ({ ...prev, siggCd: selectedSigungu, emdongCd: "ALL" }));
  
    if (selectedSigungu !== "ALL") {
      try {
        const response = await axios.post("http://localhost:80/region/emdonge", { 
          sido: formData.sidoCd, 
          sigungu: selectedSigungu 
        });
  
        if (response.data.code === 200) {
          setEmdongList(response.data.sido); // 여기를 수정: sido -> emdong
        } else {
          alert(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching Emdong list:", error);
      }
    } else {
      setEmdongList([]);
    }
  };
  
  const handleEmdongChange = (e) => {
    const selectedEmdong = e.target.value;
    setFormData((prev) => ({ ...prev, emdongCd: selectedEmdong }));
  };


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


  const fetchMeetings = async () => {
    try {
      const response = await fetch("http://localhost:80/bookMeeting/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 인증 유지
        body: JSON.stringify({}), // 필요하면 요청 데이터를 여기에 추가
      });

      const data = await response.json();
      if (data.code === 200) {
        setMeetings(data.bookMeetingList);
      } else if (data.code === 204) {
        // alert(data.result);
        setMeetings([]);
      } else {
        throw new Error(data.result || "데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("독서모임 목록 조회 실패:", error.message);
      alert("독서모임 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formattedSchedule = format(formData.schedule, "yyyy.MM.dd : HH");

    const fullAddress = [
      formData.sidoCd,
      formData.siggCd,
      formData.emdongCd,
      formData.detailedPlace
    ]
      .filter(Boolean) // 빈 값 제거
      .join(" "); // 공백으로 연결
  
    try {
      const response = await fetch("http://localhost:80/bookMeeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, place: fullAddress , schedule: formattedSchedule}), // place에 주소 조합 값 사용
      });
  
      const data = await response.json();
  
      if (data.code === 200) {
        alert("독서모임이 생성되었습니다.");
        setIsWriting(false); // 작성 폼 닫기
  
        // 새로고침 없이 최신 데이터를 다시 가져오기
        fetchMeetings();
  
        // 폼 초기화
        setFormData({
          hostLoginid: username,
          subject: "",
          content: "",
          schedule: new Date(), // 초기화
          place: "",
          total: "",
          closeYN: "N",
          sidoCd: "",
          siggCd: "",
          emdongCd: "",
          detailedPlace: "" // 상세주소 초기화
        });
      } else {
        throw new Error(data.error_message || "독서모임 생성 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert(`생성 중 오류가 발생했습니다: ${error.message}`);
    }
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("검색어를 입력하세요.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:80/bookMeeting/listByRegion", {
        place: searchQuery,
      });
  
      if (response.data.code === 200) {
        setMeetings(response.data.bookMeetingListByplace);
      } else if (response.data.code === 204) {
        alert(response.data.result); // 검색 결과 없음
        setMeetings([]); // 목록 초기화
      } else {
        throw new Error(response.data.result || "검색 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("검색 중 오류:", error.message);
      alert(`오류가 발생했습니다: ${error.message}`);
    }
  };
  
  const handleShowAllMeetings = async () => {
    try {
      const response = await fetch("http://localhost:80/bookMeeting/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 인증 유지
        body: JSON.stringify({}), // 필요하면 요청 데이터를 여기에 추가
      });
  
      const data = await response.json();
      if (data.code === 200) {
        setMeetings(data.bookMeetingList); // 전체 모임 리스트 설정
      } else if (data.code === 204) {
        setMeetings([]); // 결과가 없을 경우 빈 리스트
      } else {
        throw new Error(data.result || "데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("독서모임 목록 조회 실패:", error.message);
      alert("독서모임 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };
  const handleJoin = async (meetingId) => {
    try {
      const response = await fetch("http://localhost:80/personal-schdule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookMeetingId: meetingId })
      });
      const data = await response.json();
      if (data.code === 200) {
        alert("독서모임 참여가 완료되었습니다.");
        fetchMeetings(); // 데이터 새로고침
      } else if (data.code === 204) {
        alert(data.result); // 이미 참여한 경우
      } else {
        throw new Error(data.result || "참여 중 오류가 발생했습니다.");
      }
    } catch (error) {
      alert(`참여 중 오류가 발생했습니다: ${error.message}`);
    }
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
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
              <div>
                <p>모임일정</p>
                <DatePicker
                selected={formData.schedule}
                onChange={(date) => setFormData({ ...formData, schedule: date })}
                showTimeSelect
                dateFormat="yyyy.MM.dd : HH" // 포맷 지정
                timeFormat="HH" // 시간 포맷 지정
                timeIntervals={60} // 시간 간격
                placeholderText="날짜와 시간을 선택하세요"
            />
              </div>

              <div className="search-box public-srch02">
              <div className="sch-in sch-in-ty1">
              <p>모임장소</p>
              <div className="region-select">
              <select name="sidoCd" id="sidoCd" onChange={handleSidoChange} value={formData.sidoCd} className="region">
                <option value="">시/도 전체</option>
                {sidoList.map((sido, index) => (
                  <option key={index} value={sido}>{sido}</option>
                ))}
              </select>


              <select name="siggCd" id="siggCd" onChange={handleSigunguChange} value={formData.siggCd} className="region">
                <option value="">시/군/구 전체</option>
                {sigunguList.map((sigungu, index) => (
                  <option key={index} value={sigungu}>{sigungu}</option>
                ))}
              </select>


              <select name="emdongCd" id="emdongCd" onChange={handleEmdongChange} value={formData.emdongCd} className="region">
                <option value="">읍/면/동 전체</option>
                {emdongList.map((emdong, index) => (
                  <option key={index} value={emdong}>{emdong}</option>
                ))}
              </select>
            </div>
              </div>
            </div>
            <input
                type="text"
                placeholder="상세주소 (예: 양천향교역 1번 출구)"
                value={formData.detailedPlace}
                onChange={(e) => setFormData({ ...formData, detailedPlace: e.target.value })}
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
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
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
              <h3>{selectedMeeting.subject}</h3>
              <button className="back-button" onClick={() => setSelectedMeeting(null)}>목록으로</button>
            </div>
            <div className="meeting-detail-content">
              <p className="detail-schedule"><strong>일정:</strong> {selectedMeeting.schedule}</p>
              <p className="detail-place"><strong>장소:</strong> {selectedMeeting.place}</p>
              <p className="detail-host"><strong>주최자:</strong> {selectedMeeting.hostLoginid}</p>
              <p className="detail-total"><strong>모집 인원:</strong> {selectedMeeting.total}명</p>
              <p className="detail-available"><strong>참여 가능 인원:</strong> {selectedMeeting.total - selectedMeeting.current}명</p>
              <p className="detail-description">{selectedMeeting.content}</p>
              <p className="detail-created-at">개설일: {new Date(selectedMeeting.createdAt).toLocaleDateString()}</p>
            </div>
            {isLoggedIn && selectedMeeting.hostLoginid !== username && (
              <button 
                className={`join-button ${selectedMeeting.current === selectedMeeting.total ? 'full' : ''}`}
                onClick={() => handleJoin(selectedMeeting.id)}
                disabled={selectedMeeting.current === selectedMeeting.total}
              >
                {selectedMeeting.current === selectedMeeting.total ? '마감' : '참가하기'}
              </button>
            )}
          </div>
        ) : (
          
          <div className="meeting-list">
            <div className="meeting-search-bar">
          <h3>지역 검색</h3>
          <div className="search-box public-srch02">
            <div className="sch-in sch-in-ty1">
              <div className="region-select">
              <input
                type="text"
                placeholder="지역 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
                <button className={`region-search-button`}  onClick={handleSearch}>검색</button>
                <button className={`region-search-button`}  onClick={handleShowAllMeetings}>전체보기</button>
              </div>
            </div>
        </div>
      </div>  
            {meetings.map(meeting => (
              <div key={meeting.id} className="meeting-item">
                <div className="meeting-info" onClick={() => setSelectedMeeting(meeting)}>
                  <h3 className="meeting-title">{meeting.subject}</h3>
                  <p>일정: {meeting.schedule}</p>
                  <p>장소: {meeting.place}</p>
                  <p>주최자: {meeting.hostLoginid}</p>
                  <p>모집 인원: {meeting.total}명</p>
                  <p>참여 가능 인원: {meeting.total - meeting.current}명</p>
                  <p className="created-at">개설일: {new Date(meeting.createdAt).toLocaleDateString()}</p>
                </div>
                {isLoggedIn && meeting.hostLoginid !== userLoginId && (
                <button 
                  className={`join-button ${meeting.current === meeting.total ? 'full' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(meeting.id);
                  }}
                  disabled={meeting.current === meeting.total}
                >
                  {meeting.current === meeting.total ? '마감' : '참가하기'}
                </button>
              )}

              {isLoggedIn && meeting.hostLoginid === userLoginId && (
                <button 
                  className="join-button"
                  onClick={() => navigate(`/modify-meeting/${meeting.id}`)} // 수정 페이지로 이동
                >
                  모임 수정
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
