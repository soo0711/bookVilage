import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ChatPage.css";
import Header from "./Header";
import axios from "axios";

function ChatPage({ client, username, isLoggedIn, handleLogout }) {
  const location = useLocation();
  const { chatHistory, chatroomId, myId } = location.state || {};
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(chatHistory || []);
  const [otherUserLoginId, setOtherUserLoginId] = useState("");
  const messagesEndRef = useRef(null); // 스크롤 제어를 위한 ref 추가

  // 채팅 기록 및 사용자 정보 불러오기
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
            const users = response.data.userMessage.userList || [];

            const otherUser = users.find((user) => user.id !== myId);
            setOtherUserLoginId(otherUser ? otherUser.loginId : "알 수 없음");

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
  }, [chatroomId, myId]);

  // 스크롤을 가장 아래로 내리는 함수
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 메시지가 추가될 때마다 스크롤 업데이트
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // 메시지 수신
  useEffect(() => {
    if (client) {
      client.subscribe(`/sub/chatroom/${chatroomId}`, (message) => {
        const newMessage = JSON.parse(message.body);
        setChatMessages((prev) => [...prev, newMessage]);
      });
    }
  }, [client, chatroomId]);

  // 메시지 전송
  const [isSending, setIsSending] = useState(false);

const sendMessage = () => {
  if (isSending || !message.trim()) return;

  setIsSending(true);
  if (client) {
    const payload = {
      chatroomId: chatroomId,
      userId: myId,
      message: message.trim(),
    };

    client.send("/pub/message", {}, JSON.stringify(payload));
    setMessage("");
  }
  setIsSending(false);
};
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <Header />
      <div className="chat-container">
        <div className="chat-header">
          <h2>채팅방 - {otherUserLoginId}</h2>
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
          {/* 스크롤 제어용 빈 div */}
          <div ref={messagesEndRef} />
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
