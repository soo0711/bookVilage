import React from "react";
import "./High.css";

const High = () => {
  const books = [
    {
      id: 1,
      title: "입 속의 검은 잎",
      rating: "4.2",
      image: "/assets/book1.png",
    },
    {
      id: 2,
      title: "미생 시즌1",
      rating: "4.2",
      image: "/assets/book2.png",
    },
    {
      id: 3,
      title: "자기 앞의 생",
      rating: "4.1",
      image: "/assets/book3.png",
    },
    {
      id: 4,
      title: "밝은 밤",
      rating: "4.2",
      image: "/assets/book4.png",
    },
    {
      id: 5,
      title: "원피스",
      rating: "4.1",
      image: "/assets/book5.png",
    },
  ];

  return (
    <section className="high-books">
      <div className="left-section">
        <h2 className="section-title">평균별점이 높은 작품</h2>
      </div>
      <div className="right-section">
        <div className="books-list">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img src={book.image} alt={book.title} className="book-image" />
              <h3 className="book-title">{book.title}</h3>
              <p className="book-rating">평균 ★ {book.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default High;
