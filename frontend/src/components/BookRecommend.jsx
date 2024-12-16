import React, { useState, useEffect } from "react";
import Header from "./Header";
import BookRegisterForm from "./BookRegister";
import BookRecommendation from "./BookRecommendation";

<<<<<<< HEAD
const BookRecommend = () => {
  const [isBookRegistered, setIsBookRegistered] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  // 책 등록 핸들러 수정
  const handleBookRegister = (book) => {
    setUserBooks([book]); // 새로운 책으로 배열 업데이트
    setIsBookRegistered(true);
    
    // 임시 추천 도서 데이터 설정
    const tempRecommendedBooks = [
      {
        title: "추천도서 1",
        author: "작가1",
        image: "https://via.placeholder.com/150x200",
      },
      {
        title: "추천도서 2",
        author: "작가2",
        image: "https://via.placeholder.com/150x200",
      },
      {
        title: "추천도서 3",
        author: "작가3",
        image: "https://via.placeholder.com/150x200",
      },
    ];
    setRecommendedBooks(tempRecommendedBooks);
  };

  /* 실제 API 연동 시 사용할 함수
  const fetchRecommendedBooks = async () => {
    if (userBooks.length > 0) {
=======
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
>>>>>>> suhyun-back
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
  };

<<<<<<< HEAD
  useEffect(() => {
    if (isBookRegistered) {
      fetchRecommendedBooks();
    }
  }, [userBooks]);
  */

  return (
    <>
      <Header />
      <div className="book-recommend-page">
        {!isBookRegistered ? (
          <BookRegisterForm onRegister={handleBookRegister} />
=======
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
>>>>>>> suhyun-back
        ) : (
          <BookRecommendation
            userBooks={userBooks}
            recommendedBooks={recommendedBooks}
            username="사용자" // 임시 사용자 이름
          />
        )}
<<<<<<< HEAD
        <footer className="footer">
          <p>@copyright bookVillage</p>
        </footer>
=======

        {/* 항상 책 등록 버튼을 표시 */}
        <div className="register-button-container">
          <button onClick={() => navigate("/book-register")}>책 등록하기</button>
          <button  onClick={() => handleTasteClick(userId)}>취향 분석</button>
        </div>
>>>>>>> suhyun-back
      </div>
    </>
  );
};

export default BookRecommend;
