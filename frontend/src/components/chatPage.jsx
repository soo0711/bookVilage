import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ChatPage.css";
import Header from "./Header";
import axios from "axios";

function ChatPage({ client, username, isLoggedIn, handleLogout }) {
  const location = useLocation();
  const { chatHistory, targetUser, chatroomId , myId} = location.state || {}; // state에서 채팅 기록 가져오기
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(chatHistory || []); // 전달받은 채팅 기록을 상태에 설정
  const [userId, setUserId] = useState(null);

  // 채팅 기록 불러오기
  useEffect(() => {
    if (chatroomId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.post(
            "http://localhost:80/chat/record-list",
            { chatroomId },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (response.data.code === 200) {
            const messages = response.data.userMessage.messageList || [];
            
            setChatMessages(messages);
          } else {
            alert("채팅 기록을 불러오는 데 실패했습니다.");
          }
        } catch (error) {
          console.error("채팅 기록을 불러오는 중 에러:", error);
          alert("채팅 기록을 불러오는 중 오류가 발생했습니다.");
        }
      };

      fetchChatHistory();
    }
  }, [chatroomId]);

  // 메시지 수신
  useEffect(() => {
    if (client) {
      client.subscribe(`/sub/chatroom/${chatroomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setChatMessages((prev) => [...prev, newMessage]); // 새로운 메시지를 기존 메시지 목록에 추가
      });
    }
  }, [client, chatroomId]);

  // 메시지 전송
  const sendMessage = () => {
    if (client && message.trim()) {
      const payload = {
        chatroomId: chatroomId, // 채팅방 ID
        userId: myId,
        message: message.trim(), // 메시지 내용
      };

      client.send("/pub/message", {}, JSON.stringify(payload)); // 메시지 전송
      setMessage(""); // 입력 필드 초기화
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(); // Enter 키 입력 시 메시지 전송
    }
  };

  return (
    <>
      <Header />
      <div className="chat-container">
        <div className="chat-header">
          <h2>채팅방 {chatroomId}</h2>
          <div className="chat-info">
            <span className="user-status">● 온라인</span>
          </div>
        </div>

        <div className="messages-container">
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.userId === parseInt(myId, 10) ? "sent" : "received"}`}
              >
                <div className="message-content">
                  <span className="sender-name">
                    {msg.userId === parseInt(myId, 10) ? "나" : msg.userLoginId}
                  </span>
                  <p className="message-text">{msg.message}</p>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>채팅 기록이 없습니다.</p>
          )}
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
          <button onClick={sendMessage} className="send-button">
            전송
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatPage;
