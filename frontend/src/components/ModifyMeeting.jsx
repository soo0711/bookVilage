import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "./BookMeeting.css";
import axios from "axios"; //
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 스타일 추가
import { format } from "date-fns";

const ModifyMeeting = ({ isLoggedIn : propIsLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [userLoginId, setUserLoginId] = useState(null);
  const [userId, setUserId] = useState(null);
  const { meetingId } = useParams();
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
      const response = await fetch("http://localhost:80/bookMeeting/detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // 세션 인증 유지
        body: JSON.stringify({ bookMeetingId: meetingId }), // 필요하면 요청 데이터를 여기에 추가
      });
  
      const data = await response.json();

      
      if (data.code === 200) {
          const meeting = data.bookMeetingEntity; // API 응답에서 데이터 추출
          const placeParts = meeting.place.split(" ");
          const sido = placeParts[0] || "ALL";
          const sigg = placeParts[1] || "ALL";
          const emdong = placeParts[2] || "ALL"; // emdong 값을 우선 저장
          const detail = placeParts.slice(3).join(" ") || "";

      // '2024.12.14 : 17' 형식에서 날짜를 분리하여 ISO 형식으로 변환
      const scheduleParts = meeting.schedule.split(" : ");
      const dateParts = scheduleParts[0].split("."); // ['2024', '12', '14']
      const time = scheduleParts[1]; // '17'
      
      // 연, 월, 일, 시간 구분
      const year = dateParts[0];
      const month = dateParts[1].padStart(2, "0"); // 월 앞에 0을 추가
      const day = dateParts[2].padStart(2, "0"); // 일 앞에 0을 추가
      const formattedDate = `${year}-${month}-${day}T${time}:00:00`; // ISO 8601 형식으로 변환

      const schedule = new Date(formattedDate); // 새로운 Date 객체로 변환

      if (isNaN(schedule)) {
        throw new Error("잘못된 날짜 형식입니다.");
      }
        setFormData({
          hostLoginid: meeting.hostLoginid || username, // 호스트 로그인 ID
          subject: meeting.subject || "", // 제목
          content: meeting.content || "", // 상세 설명
          schedule: schedule,
          place: meeting.place || "", // 장소
          total: meeting.total || "", // 모집 인원
          closeYN: meeting.closeYN || "N", // 마감 여부
          sidoCd: sido || "", // 시/도 코드
          siggCd: sigg || "", // 시/군/구 코드
          emdongCd: emdong || "", // 읍/면/동 코드
          detailedPlace: detail || "",
        });
  
         if (sido !== "ALL") {
            const sigunguResponse = await axios.post("http://localhost:80/region/sigungu", { sido });
            if (sigunguResponse.data.code === 200) {
            setSigunguList(sigunguResponse.data.sigungu);
            }
        }

        if (sigg !== "ALL") {
            const emdongResponse = await axios.post("http://localhost:80/region/emdonge", { 
            sido, sigungu: sigg 
            });

            if (emdongResponse.data.code === 200) {
            // emdongResponse.data.sido에서 emdong 리스트를 가져오는 코드
            const emdongList = emdongResponse.data.sido || [];
            setEmdongList(emdongList);

            // emdongCd를 갱신: 실제 emdong 값이 '길동'이 맞다면 이를 찾고, 없으면 'ALL'로 처리
            const emdongSelected = emdongList.find(dong => {
                return dong.trim() === emdong;  // 동 이름 비교
                }) || 'ALL';
            setFormData(prevFormData => ({
                ...prevFormData,
                emdongCd: emdongSelected
            }));
            }
        }
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

  const handelCnacelUpdate = () => {
    navigate(-1);
  }

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
      const response = await fetch("http://localhost:80/bookMeeting/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, place: fullAddress , schedule: formattedSchedule, bookMeetingId: meetingId}), // place에 주소 조합 값 사용
      });
  
      const data = await response.json();
  
      if (data.code === 200) {
        alert("독서모임이 수정되었습니다.");
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
          
        </div>
          <div className="meeting-form">
            <h3>독서모임 수정하기</h3>
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
                disabled
            />
              </div>

              <div className="search-box public-srch02">
              <div className="sch-in sch-in-ty1">
              <p>모임장소</p>
              <div className="region-select">
              <select name="sidoCd" id="sidoCd" onChange={handleSidoChange} value={formData.sidoCd} className="region" disabled > 
                <option value="">시/도 전체</option>
                {sidoList.map((sido, index) => (
                  <option key={index} value={sido}>{sido}</option>
                ))}
              </select>


              <select name="siggCd" id="siggCd" onChange={handleSigunguChange} value={formData.siggCd} className="region" disabled >
                <option value="">시/군/구 전체</option>
                {sigunguList.map((sigungu, index) => (
                  <option key={index} value={sigungu}>{sigungu}</option>
                ))}
              </select>


              <select name="emdongCd" id="emdongCd" onChange={handleEmdongChange} value={formData.emdongCd} className="region" disabled >
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
                disabled 
              />
              <textarea
                placeholder="모임 상세 설명"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
              />
              <div className="form-buttons">
                <button type="submit">수정하기</button>
                <button type="button" onClick={handelCnacelUpdate}>취소</button>
              </div>
            </form>
          </div>
      </div>
    </>
  );
};

export default ModifyMeeting;
