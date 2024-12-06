import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostDetail.css";

const PostDetail = ({ post, onBack }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  // 게시글 수정/삭제
  const handleUpdate = () => {
    navigate("/community/update");
  };

  const handleDelete = () => {
    navigate("/community/delete");
  };

  // 댓글 추가
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // 빈 댓글 방지

    // 새 댓글 객체 생성
    const newCommentObj = {
      id: Date.now(), // 임시 ID
      content: newComment,
      userName: "사용자", // 실제로는 로그인된 사용자 정보 사용
      createdAt: new Date().toLocaleString()
    };

    try {
      const response = await axios.post("/community_comment/create", {
        community_id: post.id,
        userId: 1, // 임시 사용자 ID
        content: newComment,
      });

      if (response.data.code === 200) {
        // 성공 시 댓글 목록에 추가
        setComments(prevComments => [...prevComments, newCommentObj]);
        setNewComment(""); // 입력창 초기화
      } else {
        throw new Error(response.data.error_message);
      }
    } catch (error) {
      console.error("댓글 생성 오류:", error.message);
      alert("댓글 작성에 실패했습니다."); // 사용자에게 오류 알림
    }
  };

  // 엔터 키로 댓글 작성
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
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
      <div className="post-header">
        <button onClick={onBack} className="back-button">← 돌아가기</button>
        <div className="button-group">
          <button onClick={handleUpdate} className="update-button">수정</button>
          <button onClick={handleDelete} className="delete-button">삭제</button>
        </div>
      </div>
      
      <div className="post-content">
        <h2>{post.subject}</h2>
        <div className="post-info">
          <span className="author">{post.userName}</span>
          <span className="date">{post.createdAt}</span>
        </div>
        <p className="content">{post.content}</p>
      </div>

      <div className="comments">
        <h3>댓글</h3>
        {comments.length === 0 && <p className="no-comments">댓글이 없습니다.</p>}
        <ul className="comment-list">
          {comments.map((comment, index) => (
            <li key={comment.id || index} className="comment-item">
              <div className="comment-content">
                <span className="comment-author">{comment.userName || '익명'}</span>
                <span className="comment-date">{comment.createdAt}</span>
                <p>{comment.content}</p>
              </div>
              <button 
                onClick={() => handleDeleteComment(comment.id)}
                className="comment-delete-button"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="댓글을 입력하세요"
          />
          <button 
            onClick={handleAddComment} 
            className="comment-submit-button"
            disabled={!newComment.trim()}
          >
            댓글 작성
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
