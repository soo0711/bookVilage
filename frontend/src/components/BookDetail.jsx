import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import './BookDetail.css';

const BookDetail = ({ isLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <p><strong>출판일:</strong> {new Date(bookData.pubDate).toLocaleDateString()}</p>
              <p><strong>카테고리:</strong> {bookData.category}</p>
            </div>
            <div className="book-description">
              <h2>책 소개</h2>
              <p>{bookData.description ? bookData.description : '책 소개가 없습니다.'}</p>
            </div>
          </div>
        </div>
          <button type="button" class="back-btn" onClick={() => navigate(-1)}>
          이전으로
        </button>
      </div>
    </>
  );
};

export default BookDetail;
