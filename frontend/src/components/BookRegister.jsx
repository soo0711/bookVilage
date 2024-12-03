import React, { useState } from "react";
import "./BookRegister.css";

const BookRegister = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    rating: "5점",
    review: "",
    condition: "상태 좋음",
    description: "",
    image: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        image: file,
        imageUrl: imageUrl,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div>
      <form className="book-register-form" onSubmit={handleSubmit}>
        <h2>책 등록</h2>
        <input
          type="text"
          name="title"
          placeholder="책 제목"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="책 저자"
          value={formData.author}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="publisher"
          placeholder="출판사"
          value={formData.publisher}
          onChange={handleChange}
        />
        <label htmlFor="rating">평점</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="5점">5점</option>
          <option value="4점">4점</option>
          <option value="3점">3점</option>
          <option value="2점">2점</option>
          <option value="1점">1점</option>
        </select>
        <textarea
          name="review"
          placeholder="책 리뷰"
          value={formData.review}
          onChange={handleChange}
        />
        <label htmlFor="condition">책 상태</label>
        <select
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          required
        >
          <option value="상태 좋음">상태 좋음</option>
          <option value="상태 보통">상태 보통</option>
          <option value="상태 좋지 않음">상태 좋지 않음</option>
        </select>
        <textarea
          name="description"
          placeholder="책 상태 설명 (예: 4페이지가 살짝 찢어졌어요)"
          value={formData.description}
          onChange={handleChange}
        />
        <div className="image-upload-section">
          <label htmlFor="image">책 이미지</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {formData.imageUrl && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt="책 미리보기" />
            </div>
          )}
        </div>
      </form>
      <div className="button-container">
        <button type="button" onClick={() => window.history.back()}>이전 목록</button>
        <button type="submit" onClick={handleSubmit}>책 등록</button>
      </div>
    </div>
  );
};

export default BookRegister;
