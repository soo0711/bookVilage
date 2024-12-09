import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import "./BookRegister.css";

const BookRegister = ({ onRegister, username }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    point: "5",
    exchange_YN: "Y",
    b_condition: "A",
    description: "",
    isbn13: "",
    review: "",
    place: "", // 교환 장소 추가
  });

  const [searchResults, setSearchResults] = useState([]); // 검색 결과
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 여부
  const [images, setImages] = useState([]); // 첨부 이미지 파일

  // 책 검색 함수 (임시 더미 데이터 사용)
  const handleSearch = (e) => {
    e.preventDefault();

    // if (!username) {
    //   alert("로그인이 필요합니다. 로그인 후 책 등록이 가능합니다.");
    //   return;
    // }

    if (!formData.title) {
      alert("책 제목을 입력해주세요.");
      return;
    }

     

// //백엔드 연동시 사용할 실제 검색 함수
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!formData.title) {
//       alert("책 제목을 입력해주세요.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:80/book/search/title", {
//         title: formData.title,
//       });

//       if (response.data.code === 200) {
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(response.data.response, "application/xml");
//         const items = xmlDoc.getElementsByTagName("item");
//         const results = Array.from(items).map((item) => ({
//           title: item.getElementsByTagName("title")[0].textContent,
//           author: item.getElementsByTagName("author")[0]?.textContent || "Unknown",
//           isbn13: item.getElementsByTagName("isbn13")[0]?.textContent || "Unknown"
//         }));
//         setSearchResults(results);
//         setIsModalOpen(true);
//       } else {
//         alert(response.data.error_message || "검색에 실패했습니다.");
//       }
//     } catch (error) {
//       console.error("검색 요청 중 에러 :", error);
//       alert("서버와의 통신에 문제가 발생했습니다.");
//     }
//   };


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setImages(prevImages => [...prevImages, ...files]);
//     }
//   };

//   const handleDeleteImage = (index) => {
//     setImages(prevImages => prevImages.filter((_, i) => i !== index));
//   };

  /* 백엔드 연동시 사용할 실제 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onRegister) {
      await onRegister(formData);
    }
  };
  */

    // 더미 데이터
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

    setSearchResults(dummyResults); // 더미 데이터로 검색 결과 설정
    setIsModalOpen(true); // 모달 열기
  };

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 이미지 추가
  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prevImages => [...prevImages, ...files]);
    }
  };

  // 이미지 삭제
  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  // 임시 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      alert("책 제목과 저자를 입력해주세요.");
      return;
    }

    // 등록할 책 데이터 구성
    const bookData = {
      title: formData.title,
      author: formData.author,
      imageUrl: images.length > 0 ? URL.createObjectURL(images[0]) : "https://via.placeholder.com/150x200", // 이미지 URL 설정
      isbn13: formData.isbn13,
      point: formData.point,
      review: formData.review,
      b_condition: formData.b_condition,
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

  // 검색 결과 선택
  const handleResultSelect = (result) => {
    setFormData(prev => ({ 
      ...prev, 
      title: result.title,
      author: result.author,
      isbn13: result.isbn13
    }));
    setIsModalOpen(false); // 모달 닫기
  };

  return (
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
      
      {/* 교환 여부 선택: 책 상태 위로 이동 */}
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

      {/* 책 상태 및 교환 장소: 조건부 렌더링 */}
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
            name="description"
            placeholder="책 상태 설명 (상태: 4페이지가 살짝 찢어졌어요)"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="place"
            placeholder="교환 장소 입력"
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

  );
};

export default BookRegister;
