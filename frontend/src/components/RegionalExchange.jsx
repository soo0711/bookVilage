import React, { useState, useEffect } from 'react';
import Header from './Header';
import './RegionalExchange.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const MAIN_API_URL = process.env.REACT_APP_MAIN_API_URL;
const RECOMMEND_API_URL = process.env.REACT_APP_RECOMMEND_API_URL;

const RegionalExchange = ({ handleLogout, username, isLoggedIn: propIsLoggedIn }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidoList, setSidoList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(propIsLoggedIn);
  const [sigunguList, setSigunguList] = useState([]);
  const [userLoginId, setUserLoginId] = useState(null);
  const [emdongList, setEmdongList] = useState([]);
  const [myData, setMyData] = useState([]); // 내가 등록한 책들
  const [exchangeUsers, setExchangeUsers] = useState([]); // 교환 가능한 사용자 리스트
  const [formData, setFormData] = useState({
    title: '',
    sidoCd: null, // Set to null instead of 'ALL'
    siggCd: null, // Set to null instead of 'ALL'
  });
  const [myId, setMyId] = useState(null); // 내 userId

  useEffect(() => {
    axios.get(`${MAIN_API_URL}/user/api/user-info`, { withCredentials: true })
      .then(response => {
        if (response.data.userId && response.data.userLoginId) {
          setIsLoggedIn(true);
          setUserLoginId(response.data.userLoginId);
          setMyId(response.data.userId);
        } else {
          navigate('/user/sign-in-view');
        }
      })
      .catch(error => {
        console.log("사용자 정보 불러오기 실패", error);
        navigate('/user/sign-in-view');
      });
  }, [navigate]);

  useEffect(() => {
    const fetchSidoList = async () => {
      try {
        const response = await axios.post(`${MAIN_API_URL}/region/sido`);
        if (response.data.code === 200) {
          setSidoList(response.data.sido);
        } else {
          alert(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching Sido list:", error);
      }
    };

    fetchSidoList();
  }, []);

  useEffect(() => {
    const fetchAllExchangeList = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${MAIN_API_URL}/book-register/regional-exchange-list-all`, {}, {
          withCredentials: true,
        });
        const data = response.data;
        if (data.code === 200) {
          setExchangeUsers(data.data);
          setMyData(data.mydata);
          setMyId(data.myId);
        } else {
          alert(data.result || '전체 교환 리스트를 불러오는 중 문제가 발생했습니다.');
        }
      } catch (error) {
        console.error('Error fetching all exchange list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllExchangeList();
  }, []);

  const handleSidoChange = async (e) => {
    const selectedSido = e.target.value;
    setFormData((prev) => ({ ...prev, sidoCd: selectedSido, siggCd: "" }));
  
    if (selectedSido !== "ALL") {
      try {
        const response = await axios.post(`${MAIN_API_URL}/region/sigungu`, { sido: selectedSido });
        if (response.data.code === 200) {
          setSigunguList(response.data.sigungu);
        } else {
          alert(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching Sigungu list:", error);
      }
    } else {
      setSigunguList([]);
      setEmdongList([]);
    }
  };
  

  const handleSigunguChange = async (e) => {
    const selectedSigungu = e.target.value;
    setFormData((prev) => ({ ...prev, siggCd: selectedSigungu }));
  
    if (selectedSigungu !== "ALL" && selectedSigungu !== "") {
      try {
        const response = await axios.post(`${MAIN_API_URL}/region/emdonge`, {
          sido: formData.sidoCd,
          sigungu: selectedSigungu
        });
  
        if (response.data.code === 200) {
          setEmdongList(response.data.emdong);
        } else {
          alert(response.data.error_message);
        }
      } catch (error) {
        console.error("Error fetching Emdong list:", error);
      }
    } else {
      setEmdongList([]);
    }
  };
  

  const searchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${MAIN_API_URL}/book-register/regional-exchange-list`, {
        place: `${formData.sidoCd} ${formData.siggCd || ""}`.trim(),
        title: searchTerm || null,
      }, {
        withCredentials: true,
      });
      const data = response.data;
      if (data.code === 200) {
        setExchangeUsers(data.data);
        setMyId(data.myId);
        setMyData(data.mydata);
      } else {
        alert(data.result || '검색 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleChatClick = async (targetUserId) => {
    try {
      const response = await axios.post(`${MAIN_API_URL}/chat/room`, { fromUserId: targetUserId }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data.code === 200) {
        const chatRoomId = response.data.chatRoomId;
        navigate(`/chat/${chatRoomId}`, {
          state: { targetUser: targetUserId, chatroomId: chatRoomId, myId: myId },
        });
      } else {
        alert("채팅방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 중 에러:", error);
      alert("채팅방 생성 중 오류가 발생했습니다.");
    }
  };

  const getMatchingBooksMessage = (wishList, myData) => {
    const matchingBooks = myData.filter((myBook) =>
      wishList.some((wish) => wish.isbn13 === myBook.isbn13)
    );

    if (matchingBooks.length > 0) {
      const titles = matchingBooks.map((book) => (
        <strong key={book.isbn13}>{book.title}</strong>
      ));
      return (
        <>
          {titles.reduce((prev, curr) => [prev, "과 ", curr])}
          을 회원님이 가지고 있습니다.
        </>
      );
    }

    return null;
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <div className="regional-exchange-container">
        <h2>지역별 도서 교환</h2>
        <div className="search-box public-srch02">
          <div className="sch-in sch-in-ty1">
            <div className="region-select">
              <select name="sidoCd" id="sidoCd" onChange={handleSidoChange} value={formData.sidoCd} className="region" required>
                <option value="">시/도 전체</option>
                {sidoList.map((sido, index) => (
                  <option key={index} value={sido}>{sido}</option>
                ))}
              </select>

              <select name="siggCd" id="siggCd" onChange={handleSigunguChange} value={formData.siggCd} className="region" required>
                <option value="">시/군/구 전체</option>
                {sigunguList.map((sigungu, index) => (
                  <option key={index} value={sigungu}>{sigungu}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="책 제목을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="book-search-input"
              />
              <button
                type="button"
                className="region-search-button"
                onClick={searchBooks}
              >
                검색
              </button>
            </div>
          </div>
        </div>

        <div className="exchange-users-list">
          {exchangeUsers.length > 0 ? (
            exchangeUsers.map((register) => {
              const userWishlist = register.wishList || [];
              const matchedBooks = myData.filter((book) =>
                userWishlist.some((wish) => wish.isbn13 === book.isbn13)
              );

              return (
                <div key={register.bookRegister.id} className="exchange-user-item">
                  <div className="user-info-exchangeList">
                    <h3
                      onClick={() => handleUserClick(register.user.id)}
                      className="username-link"
                    >
                      사용자 : {register.user.loginId}
                    </h3>
                    <p className="exchange-location">
                      책 제목: {register.bookRegister.title}
                    </p>
                    <p className="exchange-location">
                      교환 가능 장소: {register.bookRegister.place}
                    </p>
                    <p className="exchange-description">
                      설명: {register.bookRegister.description}
                    </p>
                    <p className="exchange-condition">
                      상태: {register.bookRegister.b_condition}
                    </p>

                    {matchedBooks.length > 0 && (
                      <p className="matched-book-info">
                        {register.user.loginId}님이 원하는 책 {getMatchingBooksMessage(userWishlist, myData)}
                      </p>
                    )}
                  </div>
                  <button
                    className="chat-button"
                    onClick={() => handleChatClick(register.user.id)}
                  >
                    채팅하기
                  </button>
                </div>
              );
            })
          ) : (
            <p>교환 가능한 사용자가 없습니다. 지역을 다시 선택해주세요</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RegionalExchange;
