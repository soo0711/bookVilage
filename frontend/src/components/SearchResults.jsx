import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import './SearchResults.css';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const SearchResults = ({ isLoggedIn: propIsLoggedIn }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(new Map());
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);

  useEffect(() => {
    axios
      .get('http://localhost:80/user/api/user-info', { withCredentials: true })
      .then((response) => {
        if (response.data.userId && response.data.userLoginId) {
          setIsLoggedIn(true);
        }
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 실패', error);
      });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchWishlist = async () => {
        try {
          const response = await axios.post(
            'http://localhost:80/wishList/list',
            {},
            { withCredentials: true }
          );

          if (response.data.code === 200) {
            const wishListData = response.data.date || [];
            const wishListMap = new Map(
              wishListData.map((item) => [item.isbn13, true])
            );
            setWishlist(wishListMap);
          } else {
            console.error(response.data.result);
          }
        } catch (error) {
          console.error('위시리스트 가져오기 실패:', error);
        }
      };

      fetchWishlist();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    setSearchQuery(title || '');

    const searchBooks = async (title) => {
      try {
        const response = await axios.post('http://localhost:80/book/search/title', {
          title: title,
        });

        if (response.data.code === 200) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response.data.response, 'application/xml');
          const items = xmlDoc.getElementsByTagName('item');
          const results = Array.from(items)
            .map((item) => {
              const isbn13 = item.getElementsByTagName('isbn13')[0]?.textContent || 'Unknown';

              if (isbn13 === 'Unknown') return null;

              return {
                title: item.getElementsByTagName('title')[0].textContent,
                author: item.getElementsByTagName('author')[0]?.textContent || 'Unknown',
                isbn13: isbn13,
                cover: item.getElementsByTagName('cover')[0]?.textContent || 'Unknown',
                description:
                  item
                    .getElementsByTagName('description')[0]
                    ?.textContent.replace(/<img[^>]*>/g, '')
                    .trim() || 'Unknown',
                publisher: item.getElementsByTagName('publisher')[0]?.textContent || 'Unknown',
                pubdate: item.getElementsByTagName('pubDate')[0]?.textContent || 'Unknown',
                category:
                  item.getElementsByTagName('categoryName')[0]?.textContent?.split('>')[1] ||
                  'Unknown',
              };
            })
            .filter((item) => item !== null);

          setBooks(results);
        } else {
          alert(response.data.error_message || '검색에 실패했습니다.');
        }
      } catch (error) {
        console.error('검색 요청 중 에러 :', error);
        alert('서버와의 통신에 문제가 발생했습니다.');
      }
    };

    if (title) {
      searchBooks(title);
    }
  }, [location]);

  const toggleWishlist = async (isbn13, selectedBook) => {
    if (!isbn13) {
      console.error('유효하지 않은 ISBN13 값:', isbn13);
      return;
    }

    try {
      // BookDB 저장 로직
      const bookResponse = await axios.post(
        'http://localhost:80/book/create',
        {
          isbn13: selectedBook.isbn13,
          title: selectedBook.title,
          author: selectedBook.author,
          cover: selectedBook.cover,
          description: selectedBook.description,
          pubdate: selectedBook.pubdate,
          publisher: selectedBook.publisher,
          category: selectedBook.category,
        },
        { withCredentials: true }
      );
  
      if (bookResponse.data.result === '성공') {
        console.log('BookDB 저장 성공:', selectedBook.isbn13);
      } else if (bookResponse.data.result === '보유') {
        console.log('BookDB 보유:', selectedBook.isbn13);
      } else {
        console.error('BookDB 저장 실패:', bookResponse.data.error_message);
      }
    } catch (error) {
      console.error('BookDB 저장 중 오류:', error);
      return; // 저장 실패 시 위시리스트 로직 실행 안 함
    }


    setWishlist((prev) => {
      const newWishlist = new Map(prev);
      if (newWishlist.has(isbn13)) {
        newWishlist.delete(isbn13); // 삭제
      } else {
        newWishlist.set(isbn13, true); // 추가
      }
      return newWishlist;
    });

    try {
      if (wishlist.has(isbn13)) {
        const response = await axios.post(
          'http://localhost:80/wishList/delete',
          { isbn13: isbn13 },
          { withCredentials: true }
        );

        if (response.data.code === 200) {
          console.log('위시리스트에서 삭제 성공:', isbn13);
        } else {
          console.error('위시리스트 삭제 실패:', response.data.error_message);
        }
      } else {
        const response = await axios.post(
          'http://localhost:80/wishList/create',
          { isbn13: isbn13 },
          { withCredentials: true }
        );

        if (response.data.code === 200) {
          console.log('위시리스트에 추가 성공:', isbn13);
        } else {
          console.error('위시리스트 추가 실패:', response.data.error_message);
        }
      }
    } catch (error) {
      console.error('위시리스트 요청 중 오류:', error);
    }
  };

  const handleImageClick = async (selectedBook) => {
    try {
      // 서버에 Book 정보를 전달하여 저장
      const response = await axios.post(
        'http://localhost:80/book/create', // BookDB 저장 API 엔드포인트
        {
          isbn13: selectedBook.isbn13,
          title: selectedBook.title,
          author: selectedBook.author,
          cover: selectedBook.cover,
          description: selectedBook.description,
          pubdate: selectedBook.pubdate,
          publisher: selectedBook.publisher,
          category: selectedBook.category, // 추가된 category 데이터
        },
        { withCredentials: true }
      );
  
      if (response.data.result === "성공" ) {
        console.log('BookDB 저장 성공:', selectedBook.isbn13);
      } else if (response.data.result === "보유") {
        console.error('BookDB 보유');
      } else {
        console.error('BookDB 저장 실패:', response.data.error_message);
      }
    } catch (error) {
      console.error('BookDB 저장 중 오류:', error);
    }


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

        <div className="books-grid">
          {books.map((book) => (
            <div key={book.isbn13} className="book-card">
              <div className="book-covers" onClick={() => handleImageClick(book)}>
                <img src={book.cover} alt={book.title} />
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-publisher">{book.publisher}</p>
              </div>
              {isLoggedIn && ( // 로그인 여부에 따라 하트 버튼 표시
                <button
                  className="wishlist-button"
                  onClick={() => toggleWishlist(book.isbn13, book)}
                >
                  {wishlist.has(book.isbn13) ? (
                    <FaHeart className="heart-filled" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
