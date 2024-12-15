import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactWordcloud from 'react-wordcloud';
import Header from './Header';
import axios from "axios";
import './BookDetail.css';

const BookDetail = ({ isLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [keywordData, setKeywordData] = useState([]);
  const [keywordReviews, setKeywordReviews] = useState({});
  const [selectedKeyword, setSelectedKeyword] = useState(null);


  const fetchKeywordData = async () => {
    try {
      // axios를 사용하여 API 호출
      const response = await axios.get(`http://127.0.0.1:8000/keyword/${isbn}`, { withCredentials: true });
      
      // API 응답에서 keywords와 keyword_reviews 데이터 가져오기
      const data = response.data;

      // keywords 배열을 워드클라우드에 맞게 변환
      const words = data.keywords.map(item => ({
        text: item.keyword,
        value: item.count
      }));
      
      // 키워드 데이터 상태 업데이트
      setKeywordData(words);
  
      // 키워드 리뷰 데이터를 상태에 저장
      setKeywordReviews(data.keyword_reviews);
      
    } catch (error) {
      console.error('키워드 데이터 로딩 실패:', error);
    }
  };
  
  const handleKeywordClick = (word) => {
    setSelectedKeyword(word.text);
    setKeywordReviews(keywordReviews[word.text] || []); // 선택된 키워드의 리뷰 목록
    setShowModal(true);
  };

  // 리뷰보기 버튼 클릭 시 호출
  const handleReviewButtonClick = () => {
    setShowReviews(!showReviews);
    if (!showReviews) {
      fetchKeywordData(); // 리뷰보기 시 키워드 데이터 가져오기
    }
  };

  // 책 상세 정보를 가져오는 함수
  const fetchBookDetail = async (isbn13) => {
    try {
      const response = await fetch('http://localhost/book/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isbn13 }),  // ISBN을 JSON으로 전송
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const data = await response.json(); // 응답을 JSON으로 변환
      if (data.code !== 200) {
        throw new Error(data.error_message || '책 정보를 불러오는 데 실패했습니다. post');
      }
      return data.book; // 책 정보를 반환
    } catch (error) {
      console.error('fetchBookDetail 에러:', error.message);
      throw error;
    }
  };

  // useEffect 훅을 사용하여 컴포넌트가 마운트되면 책 정보 요청
  useEffect(() => {
    const getBookDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchBookDetail(isbn); // ISBN으로 데이터 가져오기
        console.log(data);
        setBookData(data); // 가져온 책 데이터를 상태에 저장
      } catch (err) {
        setError('책 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getBookDetail();
  }, [isbn]); // isbn이 변경될 때마다 다시 실행



  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!bookData) {
    console.log("bookData:", bookData); // 디버깅용
    return <div>책 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <>
       <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        />
      <div className="book-detail-container">
        <div className="book-detail-content">
          <div className="book-image-section">
            <img src={bookData.cover} alt={bookData.title} className="book-cover" />
          </div>
          <div className="book-info-section">
            <h1 className="book-title">{bookData.title}</h1>
            <div className="book-meta">
              <p><strong>저자:</strong> {bookData.author}</p>
              <p><strong>출판사:</strong> {bookData.publisher}</p>
              <p><strong>출판일:</strong> {bookData.pubdate}</p>
              <p><strong>카테고리:</strong> {bookData.category}</p>
            </div>
            <div className="book-description">
              <h2>책 소개</h2>
              {bookData.description ? (
              <div dangerouslySetInnerHTML={{ __html: bookData.description }} />
            ) : (
              <p>책 소개가 없습니다.</p>
            )}
            </div>
          </div>
        </div>
          <button type="button" class="back-btn" onClick={() => navigate(-1)}>
          이전으로
        </button>
        <button 
              className="review-button"
              onClick={handleReviewButtonClick}
            >
              {showReviews ? '리뷰 숨기기' : '리뷰 보기'}
            </button>
            {showReviews && (
              <div className="review-wordcloud">
                <h2>리뷰 워드 클라우드</h2>
                {keywordData && keywordData.length > 0 ? (
                <div style={{ width: '100%', height: '400px' }}>
                  <ReactWordcloud
                    words={keywordData}
                    options={{
                      colors: [
                        '#FF6B6B', // 밝은 빨강
                        '#4ECDC4', // 청록색
                        '#45B7D1', // 하늘색
                        '#96CEB4', // 민트
                        '#FFEEAD', // 연한 노랑
                        '#D4A5A5', // 연한 분홍
                        '#9B5DE5', // 보라
                        '#F15BB5'  // 분홍
                      ],
                      enableTooltip: true,
                      deterministic: true,
                      fontFamily: "'Noto Sans KR', 'Black Han Sans', sans-serif",
                      fontSizes: [20, 80],
                      fontStyle: 'normal',
                      fontWeight: 'bold',
                      padding: 3,
                      rotations: 3,
                      rotationAngles: [0, 45, 90],
                      scale: 'sqrt',
                      spiral: 'archimedean',
                      transitionDuration: 1000
                    }}
                    callbacks={{
                      onWordClick: handleKeywordClick
                    }}
                  />
                </div> ) : (
              <div className="no-reviews" style={{
                width: '100%',
                height: '400px',
                display: 'flex',
                justifyContent: 'center', // 가로 중앙 정렬
                alignItems: 'center', // 세로 중앙 정렬
                fontSize: '24px', // 글자 크기 크게
                textAlign: 'center', // 텍스트 가운데 정렬
                color: '#333' // 텍스트 색상
              }}>
                리뷰가 없습니다.
              </div>
            )}
              </div>
            )}

            {showModal && (
              <div className="modal-overlay" onClick={() => setShowModal(false)}>
                <div className="modal-content2" onClick={e => e.stopPropagation()}>
                  <h2>"{selectedKeyword}" 키워드가 포함된 리뷰</h2>
                  <button 
                    className="close-modal-button"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                  <div className="keyword-reviews-list">
                    {keywordReviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <p>{review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
    </div>
    </>
  );
};


export default BookDetail;
