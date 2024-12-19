import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'; 
import "./BookUpdate.css";
import axios from "axios";
import Header from "./Header";

const MAIN_API_URL = process.env.REACT_APP_MAIN_API_URL;
const RECOMMEND_API_URL = process.env.REACT_APP_RECOMMEND_API_URL;

const BookUpdate = ({ onRegister, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // useLocation 사용

  // location.state에서 username 가져오기
  const { username } = location.state || {}; // state로부터 username 가져오기
  const isLoggedIn = !!username; // username이 존재하면 로그인 상태로 간주
  const [bookImages, setBookImages] = useState([]); // 이미지 데이터 상태 추가
  const { bookId } = location.state || {}; // state로부터 bookId 가져오기
  
  const [formData, setFormData] = useState({
    title: "",
    point: "",
    exchange_YN: "",
    b_condition: "",
    b_description: "",
    isbn13: "",
    review: "",
    place: "",
    sidoCd: "",
    siggCd: "",
    emdongCd: "",
    status: ""
  });

const [sidoList, setSidoList] = useState([]);
const [sigunguList, setSigunguList] = useState([]);
const [emdongList, setEmdongList] = useState([]);

useEffect(() => {
    if (bookId) {
      // bookId가 있을 때 해당 책 정보를 서버에서 가져오는 API 호출
      const fetchBookDetails = async () => {
        try {
          const response = await axios.post(
            `${MAIN_API_URL}/book-register/book/update`,
            { bookRegisterId: bookId },
            { withCredentials: true }
          );
  
          if (response.data.code === 200) {
            const bookData = response.data.bookRegister;
            const bookImages = response.data.bookImage || []; // 이미지 데이터 가져오기
            // 서버에서 받은 책 데이터를 formData에 채워넣기
            let sido = "ALL";
            let sigg =  "ALL";
            let emdong = "ALL"; // emdong 값을 우선 저장
            if (bookData.place != null && bookData.place.trim() !== ""){
            const placeParts = bookData.place.split(" ");
            sido = placeParts[0] || "ALL";
            sigg = placeParts[1] || "ALL";
            emdong = placeParts[2] || "ALL"; // emdong 값을 우선 저장
            }

            setFormData({
              title: bookData.title,
              review: bookData.review,
              point: bookData.point,
              b_condition: bookData.b_condition,
              b_description: bookData.description,
              exchange_YN: bookData.exchange_YN,
              place: bookData.place,
              cover: bookData.cover,
              description: bookData.description,
              publisher: bookData.publisher,
              pubdate: bookData.pubdate,
              category: bookData.category,
              sidoCd: sido,
              siggCd: sigg,
              emdongCd: emdong,
              status: bookData.status
            });

            setBookImages(bookImages); // 이미지 데이터 설정
  
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
            alert(response.data.error_message || "책 정보를 가져오는 데 실패했습니다.");
          }
        } catch (error) {
          console.error("책 정보 불러오기 실패:", error);
          alert("서버와의 통신에 문제가 발생했습니다.");
        }
      };
  
      fetchBookDetails();
    }
  }, [bookId]); // bookId가 변경될 때마다 해당 책 정보를 불러오도록 설정


useEffect(() => {
  // 시/도 리스트 가져오기
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

  const [images, setImages] = useState([]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);
  
      // 파일이 선택된 경우 기존 이미지들 처리
      setImages(prevImages => {
        const newImages = [...prevImages, ...files]; // 스프레드 연산자 사용 권장
        return newImages;
      });
  
      // 새로 선택된 이미지 미리보기 처리
      const newBookImages = files.map(file => ({
        imagePath: URL.createObjectURL(file)
      }));
  
      // 기존 미리보기와 새 미리보기 병합
      setBookImages(prevImages => [...prevImages, ...newBookImages]);
      
      // 파일 input 초기화 (동일 파일 재선택 가능하도록)
      fileInput.value = '';
    }
  };
  

  const handleDeleteImage = (index) => {
    // 미리보기 이미지 URL 메모리 해제
    bookImages[index].imagePath && URL.revokeObjectURL(bookImages[index].imagePath);

    // bookImages와 images에서 동시에 삭제
    setBookImages((prevImages) => prevImages.filter((_, i) => i !== index));  
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));  
};
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.exchange_YN == "Y" && (formData.sidoCd == "ALL" || formData.siggCd == "ALL" || formData.emdongCd == "ALL")) {
      alert("장소를 입력해주세요.");
      return;
    }

    try {
      const data = new FormData();
      if (formData.exchange_YN === "Y" && formData.b_condition == null){
        formData.b_condition = "A";
      }
      if (formData.exchange_YN === "Y" && formData.status === "교환 불가"){
        formData.status = "교환 가능";
      }
      // Spring 컨트롤러의 매개변수와 일치하도록 메타데이터 구성
      const metadata = {
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
        bookRegisterId : bookId,
        status: formData.status
      };

      data.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );

      // 이미지 파일 추가
      if (images.length > 0) {
        images.forEach((image) => data.append("images", image));
      }

      const response = await axios.post(`${MAIN_API_URL}/book-register/update`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true 
      });

      if (response.data.code === 200) {
        alert("책 수정이 완료되었습니다!");
        navigate(-1);
      } else {
        alert(response.data.error_message || "책 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("책 수정 요청 중 에러 발생:", error);
      alert("서버와의 통신에 문제가 발생했습니다.");
    }
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
        <h2>책 수정하기</h2>
        <form onSubmit={handleSubmit}>
          <div className="title-search-container">
            <input
              type="text"
              name="title"
              placeholder="책 제목"
              value={formData.title}
              onChange={handleChange}
              required
              disabled
            />
          </div>
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
              <label htmlFor="status">교환 상태</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="교환 가능">교환 가능</option>
                  <option value="교환 완료">교환 완료</option>
                  <option value="교환 중">교환 중</option>
                </select>
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
              <select name="sidoCd" id="sidoCd" onChange={handleSidoChange} value={formData.sidoCd} className="region" required>
                <option value="">시/도 전체</option>
                {sidoList.map((sido, index) => (
                  <option key={index} value={sido}>{sido}</option>
                ))}
              </select>


              <select name="siggCd" id="siggCd" onChange={handleSigunguChange} value={formData.siggCd} className="region" required>
                <option value="">시/군/구 전체</option>
                {sigunguList.map((sigungu, index) => (
                  <option key={index} value={sigungu}>{sigungu}</option>
                ))}
              </select>


              <select name="emdongCd" id="emdongCd" onChange={handleEmdongChange} value={formData.emdongCd} className="region" required>
                <option value="">읍/면/동 전체</option>
                {emdongList.map((emdong, index) => (
                  <option key={index} value={emdong}>{emdong}</option>
                ))}
              </select>
            </div>
              </div>
            </div>
            <div className="image-preview-container">
              {bookImages.map((image, index) => (
                    <div key={index} className="image-preview-item" style={{ position: "relative" }}>
                    <img
                      src={image.imagePath.startsWith('blob:') ? image.imagePath : `http://localhost:80${image.imagePath}`}
                      alt={`Book Image ${index}`}
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/path/to/placeholder-image.png";
                      }}
                    />
                  <button
                    type="button"
                    className="delete-image-buttons"
                    onClick={() => handleDeleteImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div>
            <div className="file-status">
              {/* 새로 선택된 이미지가 없을 때만 기존 이미지 개수 표시 */}
              {bookImages.length > 0 && images.length === 0 ? (
                <span>기존 이미지: {bookImages.length}개</span>
              ) : (
                images.length > 0 && (
                  <span>선택된 이미지: {images.length}개</span>
                )
              )}
              </div>
            <label>
            교환 책 이미지<br/><br/>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            </label>
          </div>
            </>
          )}
        </form>
      </div>
      <div className="button-container">
        <button type="button" onClick={() => navigate(-1)}>
          이전 목록
        </button>
        <button type="button" onClick={handleSubmit}>
          책 수정
        </button>
      </div>
    </div>
    </>
  );
};

export default BookUpdate;
