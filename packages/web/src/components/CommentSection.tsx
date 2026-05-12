import { useState } from 'react'
import { useAtom } from 'jotai'
import { selectedPostIdAtom } from '../atoms/ui.atoms'
import { usePost } from '../hooks/usePost'
import { useAddComment } from '../hooks/useAddComment'
import { formatError } from '../lib/format-error'
import { authorHandle, formatDate, pad2 } from '../lib/format'

export function CommentSection() {
  const [selectedPostId, setSelectedPostId] = useAtom(selectedPostIdAtom)
  const [commentBody, setCommentBody] = useState('')
  const { data, isLoading } = usePost(selectedPostId ?? '')
  const addComment = useAddComment()

  if (!selectedPostId) return null

  const post = data?.post

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addComment.mutate(
      { postId: selectedPostId, body: commentBody },
      { onSuccess: () => setCommentBody('') }
    )
  }

  return (
    <div className="modal-overlay" onClick={() => setSelectedPostId(null)}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {isLoading && <p className="empty-msg">// loading post...</p>}
        {!isLoading && !post && <p className="empty-msg">// post not found</p>}

        {post && (
          <>
            <div className="modal-header">
              <h2 className="modal-title" style={{ margin: 0 }}>// {post.title}</h2>
              <button className="btn btn-ghost" onClick={() => setSelectedPostId(null)}>
                Close
              </button>
            </div>
            <p className="post-author-line">
              [ {authorHandle(post.author.name)} ]
            </p>
            <p className="post-body">{post.content}</p>

            <h3 className="panel-title" style={{ marginTop: 24 }}>
              // COMMENTS ({pad2(post.comments.length)})
            </h3>
            {post.comments.length === 0 && (
              <p className="empty-msg" style={{ marginBottom: 12 }}>// no comments yet</p>
            )}
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <span className="comment-author">
                  [ {authorHandle(comment.author.name)} ]
                </span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                <p className="comment-body">{comment.body}</p>
              </div>
            ))}

            {post.published && (
              <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
                <textarea
                  className="textarea"
                  value={commentBody}
                  onChange={(e) => {
                    setCommentBody(e.target.value)
                    if (addComment.isError) addComment.reset()
                  }}
                  placeholder="// write a comment..."
                  rows={3}
                  required
                />
                {addComment.isError && (
                  <p className="error-text">Error: {formatError(addComment.error)}</p>
                )}
                <div className="modal-actions">
                  <button
                    type="submit"
                    className="btn"
                    disabled={addComment.isPending}
                  >
                    {addComment.isPending ? 'Posting...' : '+ Comment'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
