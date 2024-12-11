import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import './SearchResults.css';
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setLocalBooks] = useState([]);  // 로컬 상태에서만 책 데이터 관리
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    setSearchQuery(title || '');

    const searchBooks = async (title) => {
      try {
        const response = await axios.post("http://localhost:80/book/search/title", {
          title: title,
        });

        if (response.data.code === 200) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data.response, "application/xml");
          const items = xmlDoc.getElementsByTagName("item");
          const results = Array.from(items).map((item) => {
            const isbn13 = item.getElementsByTagName("isbn13")[0]?.textContent || "Unknown";
            
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
          }).filter(item => item !== null);

          setLocalBooks(results);  // books 상태를 로컬에서만 업데이트
        } else {
          alert(response.data.error_message || "검색에 실패했습니다.");
        }
      } catch (error) {
        console.error("검색 요청 중 에러 :", error);
        alert("서버와의 통신에 문제가 발생했습니다.");
      }
    };

    if (title) {
      searchBooks(title);  // 쿼리 존재 시 검색
    }
  }, [location]);

const handleImageClick = (selectedBook) => {
  // ISBN을 이용해 해당 책의 상세 페이지로 이동
  navigate(`/book/${selectedBook.isbn13}`);
};

  return (
    <>
      <Header />
      <div className="search-results-container">
        <div className="search-info">
          <h2>검색 결과</h2>
          <p>"{searchQuery}"에 대한 검색 결과입니다.</p>
        </div>
        
        <div className="books-grid" >
          {books.map(book => (
            <div key={book.isbn13} className="book-card">
              <div className="book-cover" onClick={() => handleImageClick(book)}>
                <img src={book.cover} alt={book.title} />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-publisher">{book.publisher}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
