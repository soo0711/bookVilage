import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom'; 
import "./BookRegister.css";
import axios from "axios"; // 백엔드 연동시 주석 해제
import Header from "./Header";

const BookRegister = ({ onRegister, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 사용

  // location.state에서 username 가져오기
  const { username } = location.state || {}; // state로부터 username 가져오기
  const isLoggedIn = !!username; // username이 존재하면 로그인 상태로 간주
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    point: "5",
    exchange_YN: "Y",
    b_condition: "A",
    b_description: "",
    isbn13: "",
    review: "",
    place: "", // 교환 장소 추가
    cover: "", 
    description: "", 
    publisher: "", 
    pubdate: "", 
    category: ""
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
/*
  // 임시 검색 함수 (백엔드 연동 전)
  const handleSearch = (e) => {
    e.preventDefault();
    
    // 로그인 체크 임시 주석처리
    /* if (!username) {
      alert("로그인이 필요합니다. 로그인 후 책 등록이 가능합니다.");
      return;
    } */
/*
    if (!formData.title) {
      alert("책 제목을 입력해주세요.");
      return;
    }
/*
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
  */

//백엔드 연동시 사용할 실제 검색 함수
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
        const results = Array.from(items).map((item) => {
          const isbn13 = item.getElementsByTagName("isbn13")[0]?.textContent || "Unknown";
          
          // isbn13이 Unknown이면 이 항목을 제외
          if (isbn13 === "Unknown") return null;
        
          return {
            title: item.getElementsByTagName("title")[0].textContent,
            author: item.getElementsByTagName("author")[0]?.textContent || "Unknown",
            isbn13: isbn13,
            cover: item.getElementsByTagName("cover")[0]?.textContent || "Unknown",
            description: item.getElementsByTagName("description")[0]?.textContent.replace(/<img[^>]*>/g, "").trim() || "Unknown",
            publisher: item.getElementsByTagName("publisher")[0]?.textContent || "Unknown",
            pubdate: item.getElementsByTagName("pubDate")[0]?.textContent || "Unknown",
            category: item.getElementsByTagName("categoryName")[0]?.textContent?.split('>')[1] || "Unknown",
          };
        }).filter(item => item !== null); // null을 제외한 결과만 필터링


        setSearchResults(results);
        setIsModalOpen(true);
      } else {
        alert(response.data.error_message || "검색에 실패했습니다.");
      }
    } catch (error) {
      console.error("검색 요청 중 에러 :", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
    }
  };


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
/*
  // 임시 제출 함수 수정
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 등록할 책 데이터 구성
    const bookData = {
      title: formData.title,
      author: formData.author,
      imageUrl: images.length > 0 ? URL.createObjectURL(images[0]) : "https://via.placeholder.com/150x200", // 이미지 URL 설정
      isbn13: formData.isbn13,
      point: formData.point,
      review: formData.review,
      condition: formData.condition,
      description: formData.description,
      exchange_YN: formData.exchange_YN
    };

    // onRegister prop으로 전달받은 함수 실행
    if (onRegister) {
      onRegister(bookData);
    }

    // 책 추천 페이지로 이동
    navigate('/book-recommend');
  };
*/
  /* 백엔드 연동시 사용할 실제 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onRegister) {
      await onRegister(formData);
    }
  };
  */
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      alert("책 제목과 저자를 입력해주세요.");
      return;
    }

    try {
      const data = new FormData();
      
      // Spring 컨트롤러의 매개변수와 일치하도록 메타데이터 구성
      const metadata = {
        title: formData.title,
        author: formData.author,
        isbn13: formData.isbn13,
        review: formData.review,
        point: formData.point,
        b_condition: formData.b_condition,
        b_description: formData.b_description,
        exchange_YN: formData.exchange_YN,
        place: formData.place,
        cover: formData.cover, 
        description: formData.description, 
        publisher: formData.publisher,  
        pubdate: formData.pubdate,  
        category: formData.category, 
      };

      data.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );

      // 이미지 파일 추가
      if (images.length > 0) {
        images.forEach((image) => data.append("images", image));
      }

      const response = await axios.post("http://localhost:80/book-register/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true 
      });

      if (response.data.code === 200) {
        alert("책 등록이 완료되었습니다!");
        window.location.href = "http://localhost:3000/book-recommend";
      } else {
        alert(response.data.error_message || "책 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("책 등록 요청 중 에러 발생:", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
    }
  };

  const handleResultSelect = (result) => {
    setFormData(prev => ({ 
      ...prev, 
      title: result.title,
      author: result.author,
      isbn13: result.isbn13,
      cover: result.cover,
      description: result.description,
      publisher: result.publisher,
      pubdate: result.pubdate,
      category: result.category,
    }));
    setIsModalOpen(false);
  };

  return (
    <>
          {/* 헤더 컴포넌트 */}
        <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        />
    <div className="book-register-wrapper">
      <div className="book-register-form">
        <h2>책 등록하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="title-search-container">
            <input
              type="text"
              name="title"
              placeholder="책 제목"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleSearch}>검색</button>
          </div>
          <input
            type="text"
            name="author"
            placeholder="책 저자"
            value={formData.author}
            onChange={handleChange}
            required
          />
          <label htmlFor="point">평점</label>
          <select
            name="point"
            value={formData.point}
            onChange={handleChange}
            required
          >
            <option value="5">5점</option>
            <option value="4">4점</option>
            <option value="3">3점</option>
            <option value="2">2점</option>
            <option value="1">1점</option>
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
                name="exchange_YN"
                value="Y"
                checked={formData.exchange_YN === 'Y'}
                onChange={handleChange}
              />
              교환 가능
            </label>
            <label>
              <input
                type="radio"
                name="exchange_YN"
                value="N"
                checked={formData.exchange_YN === 'N'}
                onChange={handleChange}
              />
              교환 불가
            </label>
          </div>
          {formData.exchange_YN === 'Y' && (
            <>
              <label htmlFor="b_condition">책 상태</label>
              <select
                name="b_condition"
                value={formData.b_condition}
                onChange={handleChange}
                required
              >
                <option value="A">상태 좋음</option>
                <option value="B">상태 보통</option>
                <option value="C">상태 좋지 않음</option>
              </select>
              <textarea
                name="b_description"
                placeholder="책 상태 설명 (상태: 4페이지가 살짝 찢어졌어요)"
                value={formData.b_description}
                onChange={handleChange}
              />
               <input
            type="text"
            name="place"
            placeholder="교환 장소 입력 (ex. 경기도 성남시)"
            value={formData.place}
            onChange={handleChange}
           />
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
      </div>
      <div className="button-container">
        <button type="button" onClick={() => navigate('/')}>
          이전 목록
        </button>
        <button type="button" onClick={handleSubmit}>
          책 등록
        </button>
      </div>

      {/* 모달이 열리면 검색 결과 표시 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>검색 결과</h3>
            <ul>
              {searchResults.map((result, index) => (
                <li key={index} onClick={() => handleResultSelect(result)}>
                  <strong>{result.title}</strong> - {result.author} - {result.isbn13}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default BookRegister;
