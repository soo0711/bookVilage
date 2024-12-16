import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import './BookDetail.css';
import ReactWordcloud from 'react-wordcloud';

const BookDetail = ({ isLoggedIn, username }) => {
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [keywordReviews, setKeywordReviews] = useState([]);


  const tempReviewData = {
    words: [
      { text: '광주', value: 94 },
      { text: '가슴', value: 98 },
      { text: '한강', value: 89 },
      { text: '사람', value: 84 },
      { text: '마음', value: 60 },
      { text: '생각', value: 62 },
      { text: '역사', value: 56 },
      { text: '소년', value: 60 },
      { text: '아픔', value: 48 },
      { text: '눈물', value: 48 },
      { text: '고통', value: 50 },
      { text: '기억', value: 40 },
      { text: '시간', value: 30 },
      { text: '그날', value: 28 },
      { text: '한번', value: 28 }
    ]


  };
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

  // 임시 리뷰 데이터
  const sampleReviews = {
    "광주": [
      "광주의 아픈 역사가 생생하게 담겨있어요",
      "광주의 그날을 잊지 말아야 해요",
      "광주에서 일어난 일들이 가슴 아프게 다가왔습니다"
    ],
    "가슴": [
      "가슴이 먹먹해지는 이야기입니다",
      "가슴 아픈 현실이 잘 담겨있어요",
      "가슴에 오래 남을 것 같은 책이에요"
    ]
  };

  const handleKeywordClick = (word) => {
    setSelectedKeyword(word.text);
    setKeywordReviews(sampleReviews[word.text] || []);
    setShowModal(true);
  };

  useEffect(() => {
    // 실제 구현 시에는 이 부분에서 알라딘 API를 호출합니다
    setBookData(tempBookData);
    setLoading(false);
  }, [isbn]);

  /* 알라딘 API 연동 시 사용할 코드
  const fetchBookData = async () => {
    try {
      const response = await fetch(
        `https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=YOUR_TTB_KEY&itemIdType=ISBN&ItemId=${isbn}&Output=JS&Version=20131101`
      );
      const data = await response.json();
      setBookData(data.item[0]);
      setLoading(false);
    } catch (err) {
      setError('책 정보를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  };
  */

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;
  if (!bookData) return <div>책 정보를 찾을 수 없습니다.</div>;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} username={username} />
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
              <p><strong>출판일:</strong> {new Date(bookData.publication).toLocaleDateString()}</p>
              <p><strong>카테고리:</strong> {bookData.category}</p>
            </div>
            <div className="book-description">
              <h2>책 소개</h2>
              <p>{bookData.description}</p>
            </div>
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
                    words={tempReviewData.words}
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
                </div>
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
        </div>
      </div>
    </>
  );
};

export default BookDetail;
