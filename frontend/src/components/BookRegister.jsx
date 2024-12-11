import React, { useState, useEffect } from "react";
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
    place: "",
    cover: "",
    description: "",
    publisher: "",
    pubdate: "",
    category: "",
    sidoCd: "ALL",
    siggCd: "ALL",
    emdongCd: "ALL"
  });

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

  const [searchResults, setSearchResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
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
        place: formData.sidoCd + " " + formData.siggCd + " " + formData.emdongCd,
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
               <div className="search-box public-srch02">
              <div className="sch-in sch-in-ty1">
              <div className="region-select">
              <label htmlFor="sidoCd">시/도</label>
              <select name="sidoCd" id="sidoCd" onChange={handleSidoChange} value={formData.sidoCd}>
                <option value="">시/도 전체</option>
                {sidoList.map((sido, index) => (
                  <option key={index} value={sido}>{sido}</option>
                ))}
              </select>

              <label htmlFor="siggCd">시/군/구</label>
              <select name="siggCd" id="siggCd" onChange={handleSigunguChange} value={formData.siggCd}>
                <option value="">시/군/구 전체</option>
                {sigunguList.map((sigungu, index) => (
                  <option key={index} value={sigungu}>{sigungu}</option>
                ))}
              </select>

              <label htmlFor="emdongCd">읍/면/동</label>
              <select name="emdongCd" id="emdongCd" onChange={handleEmdongChange} value={formData.emdongCd}>
                <option value="">읍/면/동 전체</option>
                {emdongList.map((emdong, index) => (
                  <option key={index} value={emdong}>{emdong}</option>
                ))}
              </select>
            </div>
              </div>
            </div>
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
        <button type="button" onClick={() => navigate(-1)}>
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
                  <strong>{result.title}</strong> - {result.author}
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
