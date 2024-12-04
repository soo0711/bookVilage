import React, { useState, useEffect } from "react";
import axios from "axios";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import "./CommunityPage.css";
import Header from "./Header";
const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글

  // 게시글 목록 조회
  const fetchPosts = async () => {
    try {
      const response = await axios.get("/community/list");
      if (response.data.code === 200) {
        setPosts(response.data.result);
      } else {
        throw new Error(response.data.error_message);
      }
    } catch (error) {
      console.error("게시글 목록 조회 오류:", error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Header />
    <div className="community-page">
      <h1>커뮤니티 Q&A</h1>
      <div className="content">
        <PostList posts={posts} onSelectPost={setSelectedPost} />
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onBack={() => setSelectedPost(null)}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default CommunityPage;
