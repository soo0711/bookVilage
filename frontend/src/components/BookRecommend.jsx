import React, { useState, useEffect } from "react";
import Header from "./Header";
import BookRegisterForm from "./BookRegister";
import BookRecommendation from "./BookRecommendation";

const BookRecommend = ({ handleLogout }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]); // 추천 도서 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:80/user/api/user-info", { withCredentials: true })
      .then((response) => {
        if (response.data.userId && response.data.userLoginId) {
          setIsLoggedIn(true);
          setUsername(response.data.userLoginId);
          setUserId(response.data.userId)
        }
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error);
      });

    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://api.aladin.co.kr/recommend?query=${userBooks[0].title}`
        );
        const data = await response.json();
        setRecommendedBooks(data.books);
      } catch (error) {
        console.error("추천 책을 가져오는 중 오류 발생:", error);
      }
    }
  });

  const handleTasteClick = async (userId) => {
    try {
      // 선택한 사용자Id을 사용하여 추천 도서 API 호출
      const response = await axios.get(
        `http://127.0.0.1:8000/recommend_user/${userId}`,
        { withCredentials: true }
      );

      // 추천 도서 목록을 업데이트
      setRecommendedBooks(response.data || []);

      // 추천 도서를 BookRecommendation으로 전달
      navigate("/taste", {
        state: {
          selectedBook: userId,
          username,
          recommendedBooks: response.data || [],
        },
      });
    } catch (error) {
      console.error("추천 도서 요청 중 에러 발생:", error);
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        />

      <div className="book-recommendation-page">
        {books.length > 0 ? (
          <div className="book-lists">
            <h2>내가 등록한 책</h2>
            <div className="book-containers">
              {books.map((entry, index) => {
                const book = entry.book;
                return (
                  <div key={index} className="book-cardd" onClick={() => handleBookClick(entry)}>
                    <img src={book.cover} alt={book.title} />
                    <h3>{book.title}</h3>
                    <p>저자: {book.author}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <BookRecommendation
            userBooks={userBooks}
            recommendedBooks={recommendedBooks}
            username="사용자" // 임시 사용자 이름
          />
        )}

        {/* 항상 책 등록 버튼을 표시 */}
        <div className="register-button-container">
          <button onClick={() => navigate("/book-register")}>책 등록하기</button>
          <button  onClick={() => handleTasteClick(userId)}>취향 분석</button>
        </div>
      </div>
    </>
  );
};

export default BookRecommend;
