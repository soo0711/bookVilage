import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "./BookMeeting.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const MAIN_API_URL = process.env.REACT_APP_MAIN_API_URL;
const RECOMMEND_API_URL = process.env.REACT_APP_RECOMMEND_API_URL;

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
    detailedPlace: ""
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sidoList, setSidoList] = useState([]);
  const [sigunguList, setSigunguList] = useState([]);
  const [emdongList, setEmdongList] = useState([]);

  useEffect(() => {
    const fetchSidoList = async () => {
      try {
        const response = await axios.post(`${MAIN_API_URL}/region/sido`);
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
        const response = await axios.post(`${MAIN_API_URL}/region/sigungu`, { sido: selectedSido });
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
        const response = await axios.post(`${MAIN_API_URL}/region/emdonge`, { 
          sido: formData.sidoCd, 
          sigungu: selectedSigungu 
        });
  
        if (response.data.code === 200) {
          setEmdongList(response.data.sido);
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
    axios.get(`${MAIN_API_URL}/user/api/user-info`, {
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
      const response = await fetch(`${MAIN_API_URL}/bookMeeting/detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        body: JSON.stringify({ bookMeetingId: meetingId }),
      });
  
      const data = await response.json();

      
      if (data.code === 200) {
          const meeting = data.bookMeetingEntity;
          const placeParts = meeting.place.split(" ");
          const sido = placeParts[0] || "ALL";
          const sigg = placeParts[1] || "ALL";
          const emdong = placeParts[2] || "ALL";
          const detail = placeParts.slice(3).join(" ") || "";

      const scheduleParts = meeting.schedule.split(" : ");
      const dateParts = scheduleParts[0].split(".");
      const time = scheduleParts[1];
      
      const year = dateParts[0];
      const month = dateParts[1].padStart(2, "0");
      const day = dateParts[2].padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}T${time}:00:00`;

      const schedule = new Date(formattedDate);

      if (isNaN(schedule)) {
        throw new Error("잘못된 날짜 형식입니다.");
      }
        setFormData({
          hostLoginid: meeting.hostLoginid || username,
          subject: meeting.subject || "",
          content: meeting.content || "",
          schedule: schedule,
          place: meeting.place || "",
          total: meeting.total || "",
          closeYN: meeting.closeYN || "N",
          sidoCd: sido || "",
          siggCd: sigg || "",
          emdongCd: emdong || "",
          detailedPlace: detail || "",
        });
  
         if (sido !== "ALL") {
            const sigunguResponse = await axios.post(`${MAIN_API_URL}/region/sigungu`, { sido });
            if (sigunguResponse.data.code === 200) {
            setSigunguList(sigunguResponse.data.sigungu);
            }
        }

        if (sigg !== "ALL") {
            const emdongResponse = await axios.post(`${MAIN_API_URL}/region/emdonge`, { 
            sido, sigungu: sigg 
            });

            if (emdongResponse.data.code === 200) {
            const emdongList = emdongResponse.data.sido || [];
            setEmdongList(emdongList);

            const emdongSelected = emdongList.find(dong => {
                return dong.trim() === emdong;
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
      .filter(Boolean)
      .join(" ");
  
    try {
      const response = await fetch(`${MAIN_API_URL}/bookMeeting/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, place: fullAddress, schedule: formattedSchedule, bookMeetingId: meetingId }),
      });
  
      const data = await response.json();
  
      if (data.code === 200) {
        alert("독서모임이 수정되었습니다.");
        setIsWriting(false);
  
        fetchMeetings();
  
        setFormData({
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
          detailedPlace: ""
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
                dateFormat="yyyy.MM.dd : HH"
                timeFormat="HH"
                timeIntervals={60}
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
