import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ChatPage.css";
import Header from "./Header";

function ChatPage({ client, username, isLoggedIn }) {
  const { targetUsername } = useParams();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);

  // 채팅방 생성/입장
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
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
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
            <span className="user-status">● 온라인</span>
            {roomId && <span className="room-id">방 번호: {roomId}</span>}
          </div>
        </div>

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
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
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
