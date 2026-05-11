import { useState } from 'react'
import { useAtom } from 'jotai'
import { selectedPostIdAtom } from '../atoms/ui.atoms'
import { usePost } from '../hooks/usePost'
import { useAddComment } from '../hooks/useAddComment'

export function CommentSection() {
  const [selectedPostId, setSelectedPostId] = useAtom(selectedPostIdAtom)
  const [commentBody, setCommentBody] = useState('')
  const { data, isLoading } = usePost(selectedPostId ?? '')
  const addComment = useAddComment()

  if (!selectedPostId) return null

  const post = data?.post
  if (isLoading) return <p>Loading post...</p>
  if (!post) return <p>Post not found.</p>

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addComment.mutate(
      { postId: selectedPostId, body: commentBody },
      { onSuccess: () => setCommentBody('') }
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: 24, borderRadius: 8, width: 500, maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{post.title}</h2>
          <button onClick={() => setSelectedPostId(null)}>Close</button>
        </div>
        <p style={{ color: '#666' }}>By {post.author.name}</p>
        <p>{post.content}</p>

        <h3>Comments ({post.comments.length})</h3>
        {post.comments.map((comment) => (
          <div key={comment.id} style={{ padding: 8, marginBottom: 8, background: '#f5f5f5', borderRadius: 4 }}>
            <strong>{comment.author.name}</strong>
            <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            <p style={{ margin: '4px 0 0' }}>{comment.body}</p>
          </div>
        ))}

        {post.published && (
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              style={{ width: '100%', padding: 8 }}
              required
            />
            <button type="submit" disabled={addComment.isPending} style={{ marginTop: 8 }}>
              {addComment.isPending ? 'Posting...' : 'Add Comment'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
