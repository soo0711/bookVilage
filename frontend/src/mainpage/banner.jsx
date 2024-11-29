import React, { useState, useEffect } from "react";
import "./banner.css";

const Banner = () => {
  // 배너 데이터
  const banners = [
    { id: 1, image: "/assets/banner1.png", alt: "배너 1" },
    { id: 2, image: "/assets/banner2.png", alt: "배너 2" },
    { id: 3, image: "/assets/banner3.png", alt: "배너 3" },
    { id: 4, image: "/assets/banner4.png", alt: "배너 4" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 3초마다 배너 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(interval);
  }, [banners.length]);

  // 이전 배너로 이동
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  // 다음 배너로 이동
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="banner">
      {/* 배너 이미지 */}
      <div className="banner-image">
        <img
          src={banners[currentIndex].image}
          alt={banners[currentIndex].alt}
        />
      </div>
      {/* 좌우 화살표 버튼 */}
      <button className="prev-btn" onClick={handlePrev}>
        <img src="/assets/left.png" alt="이전" />
      </button>
      <button className="next-btn" onClick={handleNext}>
        <img src="/assets/right.png" alt="다음" />
      </button>

      {/* 하단 네비게이션 점
      <div className="dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div> */}
    </div>
  );
};

export default Banner;
