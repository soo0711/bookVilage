import React, { useState } from "react";
import axios from "axios";
import "./PostDetail.css";

const PostDetail = ({ post, onBack }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  // 댓글 추가
  const handleAddComment = async () => {
    try {
      const response = await axios.post("/community_comment/create", {
        community_id: post.id,
        userId: 1, // 임시 사용자 ID
        content: newComment,
      });
      if (response.data.code === 200) {
        setComments([...comments, { content: newComment }]);
        setNewComment("");
      } else {
        throw new Error(response.data.error_message);
      }
    } catch (error) {
      console.error("댓글 생성 오류:", error.message);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete("/community_comment/delete", {
        data: { community_comment_id: commentId },
      });
      if (response.data.code === 200) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error(response.data.error_message);
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error.message);
    }
  };

  return (
    <div className="post-detail">
      <button onClick={onBack}>← 돌아가기</button>
      <h2>{post.subject}</h2>
      <p>{post.content}</p>
      <div className="comments">
        <h3>댓글</h3>
        {comments.length === 0 && <p>댓글이 없습니다.</p>}
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <p>{comment.content}</p>
              <button onClick={() => handleDeleteComment(comment.id)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleAddComment}>댓글 작성</button>
      </div>
    </div>
  );
};

export default PostDetail;
