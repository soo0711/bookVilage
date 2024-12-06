import React from "react";
import "./PostList.css";

const PostList = ({ posts, onSelectPost }) => {
  return (
    <div className="post-list">
      <h2>게시글 목록</h2>
      {posts.length === 0 && <p>게시글이 없습니다.</p>}
      <div className="ec-base-table">
        <table>
          <colgroup>
            <col style={{ width: '8%' }} />
            <col style={{ width: '60%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '17%' }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">NO</th>
              <th scope="col" className="title-header">TITLE</th>
              <th scope="col">NAME</th>
              <th scope="col" className="date-header">DATE</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} onClick={() => onSelectPost(post)} className="post-item">
                <td className="no-cell">{post.id}</td>
                <td className="subject">
                  {post.notice && <span className="notice-icon">✓</span>}
                  {post.subject}
                  {post.isNew && <span className="new-badge">NEW</span>}
                </td>
                <td className="name-cell">{post.userName || '익명'}</td>
                <td className="date-cell">
                  {new Date(post.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostList;
