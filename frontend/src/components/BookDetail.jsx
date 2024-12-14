import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactWordcloud from 'react-wordcloud';
import Header from './Header';
import './BookDetail.css';

const BookDetail = ({ isLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  // const [keywordData, setKeywordData] = useState([]); // API 연동시 사용할 상태

  /* API 연동 시 사용할 코드
  const fetchKeywordData = async () => {
    try {
      const response = await fetch(`/api/keyword/${isbn}`);
      const data = await response.json();
      
      // API 응답을 워드클라우드 형식에 맞게 변환
      const words = data.keywords.map(item => ({
        text: item.keyword,
        value: item.count
      }));
      
      setKeywordData(words);
    } catch (error) {
      console.error('키워드 데이터 로딩 실패:', error);
    }
  };

  useEffect(() => {
    if (showReviews) {
      fetchKeywordData();
    }
  }, [showReviews, isbn]);
  */

  // 워드 클라우드 옵션
  const options = {
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
  deterministic: false,
  fontFamily: "'Noto Sans KR', 'Black Han Sans', sans-serif", // 글씨체 변경
  fontSizes: [20, 80], // 글자 크기 범위 확대
  fontStyle: 'normal',
  fontWeight: 'bold', // 글씨 두께 변경
  padding: 3,
  rotations: 3,
  rotationAngles: [0, 45, 90], // 회전 각도 추가
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000
  };

 // 임시 리뷰 데이터
  const words = [
    { text: '재미있어요', value: 64 },
    { text: '감동적', value: 55 },
    { text: '추천해요', value: 41 },
    { text: '좋아요', value: 38 },
    { text: '흥미진진', value: 34 },
    { text: '최고', value: 30 },
    { text: '몰입감', value: 28 },
    { text: '인상적', value: 25 },
    { text: '신선해요', value: 22 },
    { text: '감명깊어요', value: 20 },
    { text: '훌륭해요', value: 19 },
    { text: '독특해요', value: 18 },
    { text: '매력적', value: 17 },
    { text: '놀라워요', value: 16 },
    { text: '기대이상', value: 15 }
  ];

  // 임시 데이터 (DB 스키마에 맞춰 수정)
  const tempBookData = {
    title: "클린 코드(Clean Code)",
    author: "로버트 C. 마틴",
    publisher: "인사이트",
    publication: "2013-12-24",
    description: "프로그래머들의 필독서. 소프트웨어 개발에서 깨끗한 코드를 작성하는 방법을 설명하는 책입니다. 저자는 오브젝트 멘토(Object Mentor)의 창립자이자 'UML for Java Programmers'의 저자인 로버트 마틴으로, 깨끗한 코드를 작성하는 방법과 케이스 스터디를 통해 잘못된 코드를 깨끗한 코드로 개선하는 방법을 설명합니다.",
    cover: "https://image.aladin.co.kr/product/3288/85/cover/8966260950_1.jpg",
    category: "컴퓨터/IT"
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
              onClick={() => setShowReviews(!showReviews)}
            >
              {showReviews ? '리뷰 숨기기' : '리뷰 보기'}
            </button>
            {showReviews && (
              <div className="review-wordcloud">
                <h2>리뷰 워드 클라우드</h2>
                <div style={{ width: '100%', height: '400px' }}>
                  <ReactWordcloud 
                    words={words}
                    options={options}
                  />
                </div>
              </div>
            )}
      </div>
    </>
  );
};

export default BookDetail;
