import React, { useState } from "react";
import "./BookRegister.css";
import axios from "axios"; // Axios 추가

const BookRegister = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    rating: "5점",
    review: "",
    condition: "상태 좋음",
    description: "",
    image: "",
    imageUrl: "",
  });

  const [searchResults, setSearchResults] = useState([]); // 검색 결과 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file,
        imageUrl: imageUrl,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      alert("로그인이 필요합니다. 로그인 후 책 등록이 가능합니다.");
      return;
    }

    onRegister(formData);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("책 제목을 입력해주세요.");
      return;
    }

    try {
      const title = formData.title;
      const response = await axios.post("http://localhost:80/book/search/title", {
        title,
      });

      if (response.data.code === 200) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data.response, "application/xml");
        const items = xmlDoc.getElementsByTagName("item");
        const results = Array.from(items).map((item) => ({
          title: item.getElementsByTagName("title")[0].textContent,
          author: item.getElementsByTagName("author")[0]?.textContent || "Unknown",
          publisher: item.getElementsByTagName("publisher")[0]?.textContent || "Unknown",
          isbn13: item.getElementsByTagName("isbn13")[0]?.textContent || "Unknown"
        }));
        setSearchResults(results);
        setIsModalOpen(true); // 모달 열기
      } else {
        alert(response.data.error_message || "검색에 실패했습니다.");
      }
    } catch (error) {
      console.error("검색 요청 중 에러 발생:", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
    }
  };

  const handleResultSelect = (selectedTitle) => {
    setFormData({ ...formData, title: selectedTitle });
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div>
      <form className="book-register-form" onSubmit={handleSubmit}>
        <h2>책 등록</h2>
        <input
          type="text"
          name="title"
          placeholder="책 제목"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <button type="button" onClick={handleSearch}>검색</button>
        <input
          type="text"
          name="author"
          placeholder="책 저자"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="publisher"
          placeholder="출판사"
          value={formData.publisher}
          onChange={handleChange}
        />
        <label htmlFor="rating">평점</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="5점">5점</option>
          <option value="4점">4점</option>
          <option value="3점">3점</option>
          <option value="2점">2점</option>
          <option value="1점">1점</option>
        </select>
        <textarea
          name="review"
          placeholder="책 리뷰"
          value={formData.review}
          onChange={handleChange}
        />
        <label htmlFor="condition">책 상태</label>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          required
        >
          <option value="상태 좋음">상태 좋음</option>
          <option value="상태 보통">상태 보통</option>
          <option value="상태 좋지 않음">상태 좋지 않음</option>
        </select>
        <textarea
          name="description"
          placeholder="책 상태 설명 (예: 4페이지가 살짝 찢어졌어요)"
          value={formData.description}
          onChange={handleChange}
        />
        <div className="image-upload-section">
          <label htmlFor="image">책 상태 이미지</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="책 미리보기" />
            </div>
          )}
        </div>
      </form>
      <div className="button-container">
        <button type="button" onClick={() => window.history.back()}>이전 목록</button>
        <button type="submit" onClick={handleSubmit}>책 등록</button>
      </div>

      {/* 모달이 열리면 검색 결과 표시 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>검색 결과</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index} onClick={() => handleResultSelect(result.title)}>
                  <strong>{result.title}</strong> - {result.author}, {result.publisher}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRegister;
