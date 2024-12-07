import React, { useState } from "react";
import "./BookRegister.css";
// import axios from "axios"; // 백엔드 연동시 주석 해제

const BookRegister = ({ onRegister, username }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    rating: "5점",
    exchangeable: "Y",
    condition: "상태 좋음",
    description: "",
    isbn13: "",
    review: "",
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);

  // 임시 검색 함수 (백엔드 연동 전)
  const handleSearch = (e) => {
    e.preventDefault();
    
    // 로그인 체크 임시 주석처리
    /* if (!username) {
      alert("로그인이 필요합니다. 로그인 후 책 등록이 가능합니다.");
      return;
    } */

    if (!formData.title) {
      alert("책 제목을 입력해주세요.");
      return;
    }

    // 임시 더미 데이터
    const dummyResults = [
      {
        title: "해리포터와 마법사의 돌",
        author: "J.K. 롤링",
        isbn13: "9788983920775"
      },
      {
        title: "해리포터와 비밀의 방",
        author: "J.K. 롤링",
        isbn13: "9788983920776"
      },
      {
        title: "해리포터와 아즈카반의 죄수",
        author: "J.K. 롤링",
        isbn13: "9788983920777"
      }
    ];
    
    setSearchResults(dummyResults);
    setIsModalOpen(true);
  };

  /* 백엔드 연동시 사용할 실제 검색 함수
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("책 제목을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:80/book/search/title", {
        title: formData.title,
      });

      if (response.data.code === 200) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data.response, "application/xml");
        const items = xmlDoc.getElementsByTagName("item");
        const results = Array.from(items).map((item) => ({
          title: item.getElementsByTagName("title")[0].textContent,
          author: item.getElementsByTagName("author")[0]?.textContent || "Unknown",
          isbn13: item.getElementsByTagName("isbn13")[0]?.textContent || "Unknown"
        }));
        setSearchResults(results);
        setIsModalOpen(true);
      } else {
        alert(response.data.error_message || "검색에 실패했습니다.");
      }
    } catch (error) {
      console.error("검색 요청 중 에러   ���:", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
    }
  };
  */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...files]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // 임시 제출 함수 수정
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 등록할 책 데이터 구성
    const bookData = {
      title: formData.title,
      author: formData.author,
      imageUrl: images.length > 0 ? URL.createObjectURL(images[0]) : "https://via.placeholder.com/150x200", // 이미지 URL 설정
      isbn13: formData.isbn13,
      rating: formData.rating,
      review: formData.review,
      condition: formData.condition,
      description: formData.description,
      exchangeable: formData.exchangeable
    };

    // onRegister prop으로 전달받은 함수 실행
    if (onRegister) {
      onRegister(bookData);
    }
  };

  /* 백엔드 연동시 사용할 실제 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onRegister) {
      await onRegister(formData);
    }
  };
  */

  const handleResultSelect = (result) => {
    setFormData(prev => ({ 
      ...prev, 
      title: result.title,
      author: result.author,
      isbn13: result.isbn13
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="book-register-form">
      <h2>책 등록하기</h2>
      <form onSubmit={handleSubmit}>
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
        <label htmlFor="rating">평점</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="5점">5점</option>
          <option value="4   ">4점</option>
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
        <div className="radio-group">
          <label>교환여부:</label>
          <label>
            <input
              type="radio"
              name="exchangeable"
              value="Y"
              checked={formData.exchangeable === 'Y'}
              onChange={handleChange}
            />
            교환 가능
          </label>
          <label>
            <input
              type="radio"
              name="exchangeable"
              value="N"
              checked={formData.exchangeable === 'N'}
              onChange={handleChange}
            />
            교환 불가
          </label>
        </div>
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
          placeholder="책 상태 설명 (상태: 4페이지가 살짝 찢어졌어요)"
          value={formData.description}
          onChange={handleChange}
        />
        {formData.exchangeable === 'Y' && (
          <>
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Preview ${index}`} 
                  />
                  <button 
                    type="button"
                    className="delete-image-button"
                    onClick={() => handleDeleteImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </>
        )}
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
                <li key={index} onClick={() => handleResultSelect(result)}>
                  <strong>{result.title}</strong> - {result.author}, {result.isbn13}
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
