import {
  createLike,
  deleteLike,
  findFirstLike,
  countLikes,
} from '../generated/like.crud.js'
import { findUniquePost } from '../generated/post.crud.js'
import { findUniqueUser } from '../generated/user.crud.js'

function getPrismaErrorCode(err: unknown): string | undefined {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code: unknown }).code
    return typeof code === 'string' ? code : undefined
  }
  return undefined
}

export async function toggleLike(currentUserId: string, postId: string) {
  const user = await findUniqueUser({ id: currentUserId })
  if (!user) {
    throw new Error('User not found')
  }

  const post = await findUniquePost({ id: postId })
  if (!post) {
    throw new Error('Post not found')
  }

  const existing = await findFirstLike({
    where: { userId: currentUserId, postId },
  })

  if (existing) {
    try {
      await deleteLike({ userId_postId: { userId: currentUserId, postId } })
    } catch (err) {
      // P2025 = record to delete does not exist (concurrent unlike). Treat as success.
      if (getPrismaErrorCode(err) !== 'P2025') {
        throw err
      }
    }
    const likeCount = await countLikes({ postId })
    return { liked: false, likeCount }
  }

  try {
    await createLike({
      user: { connect: { id: currentUserId } },
      post: { connect: { id: postId } },
    })
  } catch (err) {
    // P2002 = unique constraint violation (concurrent like). Treat as success-already-liked.
    if (getPrismaErrorCode(err) !== 'P2002') {
      throw err
    }
  }
  const likeCount = await countLikes({ postId })
  return { liked: true, likeCount }
}

export async function getPostLikeStatus(
  currentUserId: string,
  postId: string
) {
  const [likeCount, existing] = await Promise.all([
    countLikes({ postId }),
    findFirstLike({ where: { userId: currentUserId, postId } }),
  ])
  return { likeCount, viewerHasLiked: existing !== null }
}
