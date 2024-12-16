import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import PostForm from "./PostForm";
import Header from "./Header";
import "./CommunityPage.css";

const CommunityPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([
    {
      id: "공지",
      subject: "[공지] 상업안전보건법에 의한 고객응대근로자 보호조치",
      userName: "슬로우앤드_CR",
      createdAt: "2020-09-01 14:03:53",
      notice: true,
      content: "공지사항 내용입니다."
    },
    // ... 기존 게시글 데이터
  ]);
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  const handleCreatePost = (newPost) => {
    const post = {
      id: posts.length + 1,
      ...newPost,
      userName: "사용자****", // 실제로는 로그인된 사용자 정보 사용
      createdAt: new Date().toLocaleString(),
      isNew: true
    };
    setPosts([...posts, post]);
    setIsWriting(false);
  };

  const handleWrite = () => {
    navigate("/community/create");
  };

  const handleDelete = (postId) => {
    // 삭제 로직
    navigate("/community/delete");
  };

  const handleUpdate = (postId) => {
    // 수정 로직
    navigate("/community/update");
  };

  return (
    <div>
      <Header />
      <div className="community-page">
        <div className="board-header">
          <h2>커뮤니티</h2>
          <button 
            className="write-button"
            onClick={handleWrite}
          >
            글쓰기
          </button>
        </div>

        {!isWriting && !selectedPost && (
          <PostList posts={posts} onSelectPost={setSelectedPost} />
        )}
        
        {isWriting && (
          <PostForm 
            onSubmit={handleCreatePost}
            onCancel={() => setIsWriting(false)}
          />
        )}

        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
            onDelete={() => handleDelete(selectedPost.id)}
            onUpdate={() => handleUpdate(selectedPost.id)}
          />
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
