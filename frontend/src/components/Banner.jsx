import React, { useState, useEffect } from "react";
import "./Banner.css";

const Banner = () => {
  const banners = [
    { id: 1, image: "/assets/banner1.png", alt: "배너 1" },
    { id: 2, image: "/assets/banner2.png", alt: "배너 2" },
    { id: 3, image: "/assets/banner3.png", alt: "배너 3" },
    { id: 4, image: "/assets/banner4.png", alt: "배너 4" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);
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

      <div className="banner-image">
        <img
          src={banners[currentIndex].image}
          alt={banners[currentIndex].alt}
        />
      </div>
      <button className="next-btn" onClick={handlePrev}>
        <img src="/assets/left.png" alt="이전" />
      </button>
      <button className="prev-btn" onClick={handleNext}>
        <img src="/assets/right.png" alt="다음" />
      </button>

    </div>
  );
};

export default Banner;
