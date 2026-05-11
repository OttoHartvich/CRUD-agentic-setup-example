import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  activeTagFilterAtom,
  filterPublishedAtom,
  selectedPostIdAtom,
} from '../atoms/ui.atoms'
import { usePosts } from '../hooks/usePosts'
import { usePostsByTag } from '../hooks/usePostsByTag'
import { formatError } from '../lib/format-error'
import { TagChip } from './TagChip'
import { TagFilter } from './TagFilter'

export function PostList() {
  const [filterPublished, setFilterPublished] = useAtom(filterPublishedAtom)
  const setSelectedPostId = useSetAtom(selectedPostIdAtom)
  const activeTag = useAtomValue(activeTagFilterAtom)
  const setActiveTag = useSetAtom(activeTagFilterAtom)

  const postsQuery = usePosts(filterPublished)
  const postsByTagQuery = usePostsByTag(activeTag)

  const isFiltering = Boolean(activeTag)
  const { data, isLoading, error } = isFiltering ? postsByTagQuery : postsQuery

  if (isLoading) return <p>Loading posts...</p>
  if (error) return <p>Error loading posts: {formatError(error)}</p>

  const posts = isFiltering
    ? postsByTagQuery.data?.postsByTag ?? []
    : postsQuery.data?.posts ?? []

  return (
    <div>
      <TagFilter />

      {!isFiltering && (
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={filterPublished === true}
              onChange={(e) => setFilterPublished(e.target.checked ? true : undefined)}
            />
            {' '}Show only published
          </label>
        </div>
      )}

      {posts.length === 0 && <p>No posts found.</p>}

      {posts.map((post) => (
        <article
          key={post.id}
          onClick={() => setSelectedPostId(post.id)}
          style={{ padding: 16, marginBottom: 12, border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }}
        >
          <h3 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <span>{post.title}</span>
            {!post.published && <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>Draft</span>}
            {post.tags.map((tag) => (
              <TagChip
                key={tag.id}
                name={tag.name}
                onClick={() => setActiveTag(tag.name)}
              />
            ))}
          </h3>
          <p style={{ color: '#666', margin: '0 0 8px' }}>
            By {post.author.name} &middot; {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p style={{ margin: 0 }}>{post.content.slice(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
          <p style={{ color: '#999', fontSize: 12, margin: '8px 0 0' }}>
            {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
          </p>
        </article>
      ))}
    </div>
  )
}
