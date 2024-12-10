import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ChatList.css';
import Header from './Header';

function ChatList({ username, isLoggedIn }) {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myId, setMyId] = useState(null); // myId 상태 추가
  // 서버에서 채팅방 목록을 가져오는 함수
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.post('http://localhost:80/chat/list', {}, {
          withCredentials: true // 쿠키를 서버에 전송
        });

        if (response.data.code === 200) {
          // UserMessageEntity 리스트로부터 상대방과의 대화만 필터링
          const myId = response.data.myId;
          setMyId(myId);
          console.log(myId);
          const filteredRooms = response.data.userMessageList
            .filter(item => item.myId !== username) // 내 ID가 아닌 채팅방만
            .map(item => {
              // 메시지 목록에서 최신 메시지 찾기
              const latestMessage = item.messageList.reduce((latest, current) => {
                return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
              }, item.messageList[0]);

              return {
                ...item.chatRoom,
                latestMessage,
                otherUser: item.userList.find(user => user.id !== username)
              };
            });
          setChatRooms(filteredRooms); // 최신 메시지를 포함한 채팅방 목록 설정
        } else {
          setError('채팅방 목록을 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        setError('채팅방 목록을 불러오는 데 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [username]);

  // 로딩 상태 처리
  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 에러 상태 처리
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Header />
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h2>채팅 목록</h2>
          <span className="chat-count">{chatRooms.length}개의 채팅방</span>
        </div>
        <div className="chat-rooms">
          {chatRooms.map((room) => (
            <Link
            key={room.id}
            to={`/chat/${room.id}`}
            state={{
              chatroomId: room.id,
              myId: myId, // 여기서 myId를 전달
            }}
            className="chat-room-item"
          >
              <div className="user-avatar">
                <img src={`https://via.placeholder.com/40`} alt="프로필" />
              </div>
              <div className="chat-room-info">
                <div className="chat-room-header">
                  <h3>{room.otherUser.loginId}</h3> {/* 상대방의 loginId */}
                  <span className="last-time">
                    {new Date(room.latestMessage.createdAt).toLocaleString()} {/* 최신 메시지의 시간 */}
                  </span>
                </div>
                <div className="chat-room-preview">
                  <p>{room.latestMessage.message}</p> {/* 최신 메시지 */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default ChatList;
