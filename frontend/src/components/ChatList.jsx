import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./ChatList.css";
import Header from "./Header";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

function ChatList({ client, username, isLoggedIn }) {
  const [chatRooms, setChatRooms] = useState([]);

  // 실제 서버 연동 시 사용할 웹소켓 구독 로직
  useEffect(() => {
    if (client && username) {
      // 사용자의 채팅방 목록 요청
      client.send("/app/chat/rooms", {}, JSON.stringify({
        username: username
      }));

      // 채팅방 목록 구독
      const subscription = client.subscribe(`/user/${username}/queue/rooms`, (message) => {
        const receivedRooms = JSON.parse(message.body);
        setChatRooms(receivedRooms);
      });

      // 새로운 채팅방 생성 알림 구독
      const newRoomSubscription = client.subscribe('/topic/new-room', (message) => {
        const newRoom = JSON.parse(message.body);
        if (newRoom.participants.includes(username)) {
          setChatRooms(prev => [...prev, newRoom]);
        }
      });

      // 채팅방 업데이트 구독 (새 메시지, 읽음 상태 등)
      const updateSubscription = client.subscribe(`/user/${username}/queue/room-updates`, (message) => {
        const update = JSON.parse(message.body);
        setChatRooms(prev => prev.map(room => 
          room.roomId === update.roomId ? { ...room, ...update } : room
        ));
      });

      // 컴포넌트 언마운트 시 구독 해제
      return () => {
        subscription.unsubscribe();
        newRoomSubscription.unsubscribe();
        updateSubscription.unsubscribe();
      };
    }
  }, [client, username]);

  // 임시 테스트용 채팅방 데이터
  const testChatRooms = [
    {
      roomId: 1,
      message_to: "조희언",
      lastMessage: "네, 내일 5시에 강남역 스타벅스 앞에서 만나요!",
      lastMessageTime: "14:30",
      unreadCount: 0
    },
    {
      roomId: 2,
      message_to: "김채연",
      lastMessage: "혹시 해리포터 시리즈 교환하실래요?",
      lastMessageTime: "어제",
      unreadCount: 2
    },
    {
      roomId: 3,
      message_to: "전수현",
      lastMessage: "책 상태가 어떤가요?",
      lastMessageTime: "2일 전",
      unreadCount: 0
    }
  ];

  return (
    <>
      <Header />
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h2>채팅 목록</h2>
          {/* 실제 서버 연동 시: chatRooms.length 사용 */}
          <span className="chat-count">{testChatRooms.length}개의 채팅방</span>
        </div>
        <div className="chat-rooms">
          {/* 실제 서버 연동 시: chatRooms.map() 사용 */}
          {testChatRooms.map((room) => (
            <Link 
              to={`/chat/${room.message_to}`} 
              key={room.roomId} 
              className="chat-room-item"
            >
              <div className="user-avatar">
                <img src={`https://via.placeholder.com/40`} alt="프로필" />
              </div>
              <div className="chat-room-info">
                <div className="chat-room-header">
                  <h3>{room.message_to}</h3>
                  <span className="last-time">{room.lastMessageTime}</span>
                </div>
                <div className="chat-room-preview">
                  <p>{room.lastMessage}</p>
                  {room.unreadCount > 0 && (
                    <span className="unread-count">{room.unreadCount}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {/* 실제 서버 연동 시 사용할 JSX */}
          {/* {chatRooms.map((room) => (
            <Link 
              to={`/chat/${room.message_to}`} 
              key={room.roomId} 
              className="chat-room-item"
            >
              <div className="user-avatar">
                <img 
                  src={room.profileImage || `https://via.placeholder.com/40`} 
                  alt="프로필" 
                />
              </div>
              <div className="chat-room-info">
                <div className="chat-room-header">
                  <h3>{room.message_to}</h3>
                  <span className="last-time">
                    {formatTimestamp(room.lastMessageTime)}
                  </span>
                </div>
                <div className="chat-room-preview">
                  <p>{room.lastMessage}</p>
                  {room.unreadCount > 0 && (
                    <span className="unread-count">{room.unreadCount}</span>
                  )}
                </div>
              </div>
            </Link>
          ))} */}
        </div>
      </div>
    </>
  );
}

// 타임스탬프 포맷팅 유틸리티 함수
/* const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays <= 7) {
    return `${diffDays}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    });
  }
}; */

export default ChatList;