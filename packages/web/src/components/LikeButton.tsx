import { useToggleLikePost } from '../hooks/useToggleLikePost'
import { pad2 } from '../lib/format'
import { formatError } from '../lib/format-error'

interface LikeButtonProps {
  postId: string
  likeCount: number
  viewerHasLiked: boolean
}

export function LikeButton({ postId, likeCount, viewerHasLiked }: LikeButtonProps) {
  const toggleLike = useToggleLikePost()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (toggleLike.isPending) return
    if (toggleLike.isError) toggleLike.reset()
    toggleLike.mutate(postId)
  }

  const optimistic = toggleLike.isPending
  const displayLiked = optimistic ? !viewerHasLiked : viewerHasLiked
  const displayCount = optimistic
    ? likeCount + (viewerHasLiked ? -1 : 1)
    : likeCount

  const errorMessage = toggleLike.isError ? formatError(toggleLike.error) : null

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={toggleLike.isPending}
        className={`tag${displayLiked ? ' active' : ''}`}
        style={{
          font: 'inherit',
          opacity: toggleLike.isPending ? 0.4 : 1,
          cursor: toggleLike.isPending ? 'not-allowed' : 'pointer',
        }}
        aria-pressed={displayLiked}
        aria-label={displayLiked ? 'Unlike post' : 'Like post'}
        title={errorMessage ? `err: ${errorMessage}` : undefined}
      >
        <span aria-hidden>{displayLiked ? '<3' : '</3'}</span>
        <span>{pad2(displayCount)}</span>
        {errorMessage && <span aria-hidden> !</span>}
      </button>
      {errorMessage && (
        <span
          className="error-text"
          role="status"
          aria-live="polite"
          style={{ marginLeft: 6 }}
        >
          // err: {errorMessage}
        </span>
      )}
    </>
  )
}
