import React, { useState } from "react";
import "./Notice.css";

const Notice = () => {
  const [lastUpdate, setLastUpdate] = useState("2024.11.27");

  return (
    <section className="notice-section">
      
      <div className="divider"></div>

      <div className="notice">
        <span className="notice-title">공지사항</span>
        <span className="notice-content">
          책 업데이트 ({lastUpdate} 기준)
        </span>
      </div>

      <div className="divider"></div>

      <footer className="footer">
        <p>@copyright bookVillage</p>
      </footer>
    </section>
  );
};

export default Notice;
