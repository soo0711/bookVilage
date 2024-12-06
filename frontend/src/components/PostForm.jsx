import React, { useState } from 'react';
import './PostForm.css';

const PostForm = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: post?.subject || '',
    content: post?.content || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...post,
      ...formData,
      userId: 1 // 임시 사용자 ID
    });
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2>{post ? '게시글 수정' : '새 게시글 작성'}</h2>
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="제목을 입력하세요"
        required
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="내용을 입력하세요"
        required
      />
      <div className="button-group">
        <button type="submit">
          {post ? '수정하기' : '작성하기'}
        </button>
        <button type="button" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
};

export default PostForm;
