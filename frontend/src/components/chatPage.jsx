import React, { useState, useEffect } from "react";

function ChatPage({ client, username, isLoggedIn }) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  // 메시지 수신
  useEffect(() => {
    if (client) {
      client.subscribe("/sub/chatroom/1", (message) => {
        const newMessage = JSON.parse(message.body);
        setChatMessages((prev) => [...prev, newMessage]);
      });
    }
  }, [client]);

  // 메시지 전송
  const sendMessage = () => {
    // if (!isLoggedIn) {
    //   alert("로그인이 필요합니다.");
    //   return;
    // }

    if (client && message.trim()) {
      const payload = {
        chatroomId: 1, // 채팅방 ID
        userId: 5, // 고유 ID (수정 가능)
        message: message.trim(),
      };

      client.send("/pub/message", {}, JSON.stringify(payload));
      setMessage(""); // 입력 필드 초기화
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat Room</h1>
      <div style={{ marginBottom: "20px" }}>
        <h3>Messages</h3>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            height: "300px",
            overflowY: "scroll",
          }}
        >
          {chatMessages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.sender}</strong>: {msg.message}
            </p>
          ))}
        </div>
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;
