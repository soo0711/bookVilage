import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ChatPage.css";
import Header from "./Header";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';




function ChatPage({ client, username, isLoggedIn }) {
  const { targetUsername } = useParams();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);
  
  /* // 추가할 상태들
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetUserStatus, setTargetUserStatus] = useState('offline');
  const [isTyping, setIsTyping] = useState(false);
  const [lastRead, setLastRead] = useState(null); */

  useEffect(() => {
    if (client) {
      // 채팅방 생성/입장 요청
      client.send("/chat/room", {}, JSON.stringify({
        message_from: username,
        message_to: targetUsername
      }));

      // 채팅방 생성/입장 응답 구독
      client.subscribe('/user/queue/room', (response) => {
        const room = JSON.parse(response.body);
        setRoomId(room.roomId);
        
        // 채팅방 메시지 구독
        if (room.roomId) {
          client.subscribe(`/sub/chat/room/${room.roomId}`, (message) => {
            const newMessage = JSON.parse(message.body);
            setChatMessages(prev => [...prev, newMessage]);
          });
        }
      });
    }
  }, [client, username, targetUsername]);

  /* // 실제 서버 연동 시 추가할 useEffect들
  
  // 이전 채팅 내역 불러오기
  useEffect(() => {
    if (roomId) {
      setIsLoading(true);
      fetch(`http://localhost:8080/api/chat/history/${roomId}`)
        .then(response => response.json())
        .then(data => {
          setChatMessages(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError('채팅 내역을 불러오는데 실패했습니다.');
          setIsLoading(false);
        });
    }
  }, [roomId]);

  // 상대방 온라인 상태 구독
  useEffect(() => {
    if (client && roomId) {
      const statusSubscription = client.subscribe(
        `/user/queue/status/${targetUsername}`,
        (message) => {
          const status = JSON.parse(message.body);
          setTargetUserStatus(status.isOnline ? 'online' : 'offline');
        }
      );

      return () => statusSubscription.unsubscribe();
    }
  }, [client, roomId, targetUsername]);

  // 타이핑 상태 구독
  useEffect(() => {
    if (client && roomId) {
      const typingSubscription = client.subscribe(
        `/sub/chat/typing/${roomId}`,
        (message) => {
          const typingInfo = JSON.parse(message.body);
          if (typingInfo.username !== username) {
            setIsTyping(typingInfo.isTyping);
          }
        }
      );

      return () => typingSubscription.unsubscribe();
    }
  }, [client, roomId, username]);

  // 읽음 상태 업데이트
  useEffect(() => {
    if (client && roomId) {
      const readSubscription = client.subscribe(
        `/sub/chat/read/${roomId}`,
        (message) => {
          const readInfo = JSON.parse(message.body);
          setLastRead(readInfo.timestamp);
        }
      );

      // 채팅방 포커스 시 읽음 상태 전송
      const handleFocus = () => {
        client.send("/pub/chat/read", {}, JSON.stringify({
          roomId: roomId,
          username: username,
          timestamp: new Date().toISOString()
        }));
      };

      window.addEventListener('focus', handleFocus);
      return () => {
        readSubscription.unsubscribe();
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [client, roomId, username]); */

  /* // 타이핑 상태 전송
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (client && roomId) {
      client.send("/pub/chat/typing", {}, JSON.stringify({
        roomId: roomId,
        username: username,
        isTyping: e.target.value.length > 0
      }));
    }
  }; */

  const sendMessage = () => {
    if (client && message.trim() && roomId) {
      const messageData = {
        message_from: username,
        message_to: targetUsername,
        content: message.trim(),
        roomId: roomId
      };

      // 메시지 전송
      client.send("/pub/message", {}, JSON.stringify(messageData));
      setMessage("");
      
      /* // 실제 서버 연동 시 추가할 코드
      // 타이핑 상태 해제
      client.send("/pub/chat/typing", {}, JSON.stringify({
        roomId: roomId,
        username: username,
        isTyping: false
      })); */
    }
  };

  // 임시 테스트용 메시지 데이터
  const testMessages = [
    {
      message_from: username,
      message_to: targetUsername,
      content: "안녕하세요! 책 교환하고 싶어서 연락드립니다.",
      time: "14:30"
    },
    {
      message_from: targetUsername,
      message_to: username,
      content: "네, 안녕하세요! 어떤 책을 교환하고 싶으신가요?",
      time: "14:31"
    }
  ];

  return (
    <>
      <Header />
      <div className="chat-container">
        <div className="chat-header">
          <h2>{targetUsername}님과의 대화</h2>
          <div className="chat-info">
            {/* 실제 서버 연동 시 사용할 상태 표시
            <span className={`user-status ${targetUserStatus}`}>
              ● {targetUserStatus === 'online' ? '온라인' : '오프라인'}
            </span> */}
            <span className="user-status">● 온라인</span>
            {roomId && <span className="room-id">방 번호: {roomId}</span>}
          </div>
        </div>

        {/* 실제 서버 연동 시 로딩 상태 표시 
        {isLoading && (
          <div className="loading-message">
            채팅 내역을 불러오는 중...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )} */}

        <div className="messages-container">
          {/* 서버 연동 전 테스트용 메시지 표시 */}
          {testMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.message_from === username ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <span className="sender-name">
                  {msg.message_from === username ? '나' : msg.message_from}
                </span>
                <p className="message-text">{msg.content}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          
          {/* 실제 메시지 표시 */}
          {chatMessages.map((msg, index) => (
            <div 
              key={`real-${index}`} 
              className={`message ${msg.message_from === username ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <span className="sender-name">
                  {msg.message_from === username ? '나' : msg.message_from}
                </span>
                <p className="message-text">{msg.content}</p>
                <span className="message-time">
                  {new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {/* 실제 서버 연동 시 읽음 상태 표시 
                {msg.message_from === username && lastRead > msg.timestamp && (
                  <span className="read-status">읽음</span>
                )} */}
              </div>
            </div>
          ))}

          {/* 실제 서버 연동 시 타이핑 상태 표시 
          {isTyping && (
            <div className="typing-indicator">
              {targetUsername}님이 입력중입니다...
            </div>
          )} */}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // 실제 서버 연동 시: onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="메시지를 입력하세요..."
            className="chat-input"
          />
          <button 
            onClick={sendMessage}
            className="send-button"
            disabled={!roomId}
          >
            전송
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatPage;