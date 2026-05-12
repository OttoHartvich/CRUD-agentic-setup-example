import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  activeTagFilterAtom,
  filterPublishedAtom,
  selectedPostIdAtom,
} from '../atoms/ui.atoms'
import { usePosts } from '../hooks/usePosts'
import { usePostsByTag } from '../hooks/usePostsByTag'
import { useListTags } from '../hooks/generated/tag.hooks'
import { formatError } from '../lib/format-error'
import { authorHandle, formatDate, pad2 } from '../lib/format'

export function PostList() {
  const [filterPublished, setFilterPublished] = useAtom(filterPublishedAtom)
  const setSelectedPostId = useSetAtom(selectedPostIdAtom)
  const activeTag = useAtomValue(activeTagFilterAtom)
  const setActiveTag = useSetAtom(activeTagFilterAtom)

  const postsQuery = usePosts(filterPublished)
  const postsByTagQuery = usePostsByTag(activeTag)
  const tagsQuery = useListTags()

  const isFiltering = Boolean(activeTag)
  const { isLoading, error } = isFiltering ? postsByTagQuery : postsQuery

  const posts = isFiltering
    ? postsByTagQuery.data?.postsByTag ?? []
    : postsQuery.data?.posts ?? []

  const tags = tagsQuery.data?.tags ?? []

  return (
    <div>
      <div className="tags" role="list">
        <span
          className={`tag${!activeTag ? ' active' : ''}`}
          onClick={() => setActiveTag('')}
        >
          all
        </span>
        {tags.map((tag) => (
          <span
            key={tag.id}
            className={`tag${activeTag === tag.name ? ' active' : ''}`}
            onClick={() => setActiveTag(tag.name)}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {!isFiltering && (
        <div className="filter-row">
          <label>
            <input
              type="checkbox"
              checked={filterPublished === true}
              onChange={(e) =>
                setFilterPublished(e.target.checked ? true : undefined)
              }
            />
            {' '}// SHOW PUBLISHED ONLY
          </label>
          <span className="results">// {pad2(posts.length)} RESULTS</span>
        </div>
      )}

      {isFiltering && (
        <div className="filter-row">
          <span>// FILTER: {activeTag.toUpperCase()}</span>
          <span className="results">// {pad2(posts.length)} RESULTS</span>
        </div>
      )}

      {isLoading && <p className="empty-msg">// loading posts...</p>}
      {error && (
        <p className="empty-msg" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
          // error: {formatError(error)}
        </p>
      )}
      {!isLoading && !error && posts.length === 0 && (
        <p className="empty-msg">// no posts found</p>
      )}

      {posts.map((post) => {
        const commentCount = post.comments.length
        const tagNames = post.tags.map((t) => t.name)
        return (
          <article
            key={post.id}
            className="post-card"
            onClick={() => setSelectedPostId(post.id)}
          >
            <h3>
              <span>{post.title}</span>
              {!post.published && <span className="draft">DRAFT</span>}
            </h3>
            <div className="meta">
              [ {authorHandle(post.author.name)} ] · {formatDate(post.createdAt)} · {pad2(commentCount)}{' '}
              {commentCount === 1 ? 'COMMENT' : 'COMMENTS'}
            </div>
            <p className="body">
              {post.content.slice(0, 200)}
              {post.content.length > 200 ? '...' : ''}
            </p>
            <div className="footer-row">
              <span>
                {tagNames.length > 0
                  ? `// tagged: ${tagNames.join(' · ')}`
                  : '// untagged'}
              </span>
              <span>↗ open</span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
