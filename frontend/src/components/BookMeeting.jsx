import React, { useState } from "react";
import "./BookMeeting.css";
import Header from "./Header";

const BookMeeting = () => {
  const [bookMeetings, setBookMeetings] = useState([]); // 독서모임 리스트
  const [formData, setFormData] = useState({
    bookMeetingId: null,
    schedule: "",
    place: "",
    total: "",
  });
  const [isEdit, setIsEdit] = useState(false); // 수정 모드 여부

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 독서모임 생성
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/bookMeeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.code === 200) {
        alert("독서모임이 성공적으로 생성되었습니다.");
        setBookMeetings([...bookMeetings, formData]);
        setFormData({ schedule: "", place: "", total: "" });
      } else {
        throw new Error(data.error_message);
      }
    } catch (error) {
      alert(`생성 중 오류 발생: ${error.message}`);
    }
  };

  // 독서모임 수정
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/bookMeeting/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.code === 200) {
        alert("독서모임이 성공적으로 수정되었습니다.");
        setBookMeetings(
          bookMeetings.map((meeting) =>
            meeting.bookMeetingId === formData.bookMeetingId
              ? formData
              : meeting
          )
        );
        setFormData({ schedule: "", place: "", total: "" });
        setIsEdit(false);
      } else {
        throw new Error(data.error_message);
      }
    } catch (error) {
      alert(`수정 중 오류 발생: ${error.message}`);
    }
  };

  // 독서모임 삭제
  const handleDelete = async (bookMeetingId) => {
    try {
      const response = await fetch("/bookMeeting/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookMeetingId }),
      });
      const data = await response.json();
      if (data.code === 200) {
        alert("독서모임이 성공적으로 삭제되었습니다.");
        setBookMeetings(
          bookMeetings.filter((meeting) => meeting.bookMeetingId !== bookMeetingId)
        );
      } else {
        throw new Error(data.error_message);
      }
    } catch (error) {
      alert(`삭제 중 오류 발생: ${error.message}`);
    }
  };

  // 수정 모드 진입
  const handleEdit = (meeting) => {
    setFormData(meeting);
    setIsEdit(true);
  };

  return (
    <>
      <Header />
    <div className="book-meeting-page">
      <h2>독서모임 {isEdit ? "수정" : "생성"}</h2>
      <form onSubmit={isEdit ? handleUpdate : handleCreate}>
        {isEdit && (
          <input
            type="hidden"
            name="bookMeetingId"
            value={formData.bookMeetingId}
          />
        )}
        <input
          type="text"
          name="schedule"
          placeholder="독서모임 일정"
          value={formData.schedule}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="place"
          placeholder="독서모임 장소"
          value={formData.place}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="total"
          placeholder="독서모임 인원"
          value={formData.total}
          onChange={handleChange}
          required
        />
        <button type="submit">{isEdit ? "수정" : "생성"}</button>
      </form>
      <h2>등록된 독서모임</h2>
      <ul className="book-meeting-list">
        {bookMeetings.map((meeting) => (
          <li key={meeting.bookMeetingId} className="book-meeting-item">
            <p>일정: {meeting.schedule}</p>
            <p>장소: {meeting.place}</p>
            <p>총 인원: {meeting.total}명</p>
            <button onClick={() => handleEdit(meeting)}>수정</button>
            <button onClick={() => handleDelete(meeting.bookMeetingId)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
      
    </div>
    <footer className="footer">
        <p>@copyright bookVillage</p>
      </footer>
    </>
  );
};

export default BookMeeting;
