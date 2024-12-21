import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import "./BookRecommend.css";

const MAIN_API_URL = process.env.REACT_APP_MAIN_API_URL;
const RECOMMEND_API_URL = process.env.REACT_APP_RECOMMEND_API_URL;

const BookRecommend = ({ handleLogout }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${MAIN_API_URL}/user/api/user-info`, { withCredentials: true })
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
        const response = await axios.get(
          `${MAIN_API_URL}/book-register/list`,
          { withCredentials: true }
        );

        if (response.data.code === 200) {
          setBooks(response.data.data || []);
        } else {
          alert("책 데이터를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("책 리스트 요청 중 에러 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookClick = async (entry) => {
    try {
      const response = await axios.get(
        `http://ceprj.gachon.ac.kr:60031/api/recommend/${entry.book.isbn13}`,
        { withCredentials: true }
      );

      setRecommendedBooks(response.data.recommendations || []);

      navigate("/recommendation", {
        state: {
          selectedBook: entry,
          username,
          recommendedBooks: response.data.recommendations || [],
        },
      });
    } catch (error) {
      console.error("추천 도서 요청 중 에러 발생:", error);
    }
  };

  const handleTasteClick = async (userId) => {
    try {
      const response = await axios.get(
        `http://ceprj.gachon.ac.kr:60031/api/recommend_user/${userId}`,
        { withCredentials: true }
      );

      setRecommendedBooks(response.data || []);

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
          <div className="no-books">
            <h2>등록된 책이 없습니다.</h2>
            <p>책 등록을 먼저 진행해주세요.</p>
          </div>
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
