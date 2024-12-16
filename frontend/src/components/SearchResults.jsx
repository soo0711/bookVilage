import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import './SearchResults.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const SearchResults = ({ userId }) => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  
  const [books] = useState([
    {
      id: 1,
      title: "해리포터와 마법사의 돌",
      author: "J.K. 롤링",
      publisher: "문학수첩",
      pubDate: "2019-11-20",
      cover: "https://example.com/cover1.jpg",
      description: "해리 포터 시리즈의 첫 번째 책...",
      isbn: "8983920726"
    },
    {
      id: 2,
      title: "데미안",
      author: "헤르만 헤세",
      publisher: "민음사",
      pubDate: "2021-03-15",
      cover: "https://example.com/cover2.jpg",
      description: "한 소년의 성장을 그린 소설...",
      isbn: "8937460149"
    },
  ]);

  const [wishlist, setWishlist] = useState(new Set());

  const toggleWishlist = (isbn) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(isbn)) {
        newWishlist.delete(isbn);
      } else {
        newWishlist.add(isbn);
      }
      return newWishlist;
    });
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
  {books.map(book => (
    <div key={book.id} className="book-card">
      <div className="book-cover">
        <img src={book.cover} alt={book.title} />
      </div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-publisher">{book.publisher}</p>
      </div>
      <button 
        className="wishlist-button"
        onClick={() => toggleWishlist(book.isbn)}
      >
        {wishlist.has(book.isbn) ? 
          <FaHeart className="heart-filled" /> : 
          <FaRegHeart />
        }
      </button>
    </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;