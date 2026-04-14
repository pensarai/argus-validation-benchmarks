import React, { useState } from 'react';
import Avatar from './Avatar';
import { formatRelativeTime } from '@app/shared-types';
import { useAddComment } from '../api/hooks/useTasks';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: { id: string; name: string; avatarUrl: string | null };
  createdAt: string;
}

interface CommentThreadProps {
  taskId: string;
  comments: Comment[];
}

export default function CommentThread({ taskId, comments }: CommentThreadProps): React.ReactElement {
  const [newComment, setNewComment] = useState('');
  const addComment = useAddComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment.mutate({ taskId, content: newComment.trim() }, {
      onSuccess: () => setNewComment(''),
    });
  };

  return (
    <div className="comment-thread">
      <h4>Comments ({comments.length})</h4>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <Avatar name={comment.author.name} avatarUrl={comment.author.avatarUrl} size="sm" />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{comment.author.name}</span>
                <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          maxLength={2000}
          rows={3}
        />
        <button type="submit" disabled={!newComment.trim() || addComment.isPending}>
          {addComment.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}
