import { useState } from 'react'
import { useAtom } from 'jotai'
import { isCreateModalOpenAtom } from '../atoms/ui.atoms'
import { useCreatePost } from '../hooks/useCreatePost'
import { useAddTagToPost } from '../hooks/useAddTagToPost'
import { TagChip } from './TagChip'
import { formatError } from '../lib/format-error'

export function PostForm() {
  const [isOpen, setIsOpen] = useAtom(isCreateModalOpenAtom)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pendingTags, setPendingTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isAttachingTags, setIsAttachingTags] = useState(false)
  const [tagAttachErrors, setTagAttachErrors] = useState<string[]>([])
  const createPost = useCreatePost()
  const addTagToPost = useAddTagToPost()

  if (!isOpen) return null

  const trimmedTagInput = tagInput.trim()
  const canAddTag = trimmedTagInput.length > 0 && !pendingTags.includes(trimmedTagInput)

  const addPendingTag = () => {
    if (!canAddTag) return
    setPendingTags((prev) => (prev.includes(trimmedTagInput) ? prev : [...prev, trimmedTagInput]))
    setTagInput('')
  }

  const removePendingTag = (name: string) => {
    setPendingTags((prev) => prev.filter((t) => t !== name))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addPendingTag()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (createPost.isPending || isAttachingTags) return
    setTagAttachErrors([])
    createPost.mutate(
      { title, content },
      {
        onSuccess: async (data) => {
          if (!data?.createPost) {
            setTagAttachErrors(['Post creation returned no data'])
            return
          }
          const newPost = data.createPost
          const errors: string[] = []
          if (pendingTags.length > 0) {
            setIsAttachingTags(true)
            try {
              for (const tagName of pendingTags) {
                try {
                  await addTagToPost.mutateAsync({ postId: newPost.id, tagName })
                } catch (err) {
                  errors.push(`Post created but failed to attach tag '${tagName}': ${formatError(err)}`)
                }
              }
            } finally {
              setIsAttachingTags(false)
            }
          }
          if (errors.length > 0) {
            setTagAttachErrors(errors)
            return
          }
          setTitle('')
          setContent('')
          setPendingTags([])
          setIsOpen(false)
        },
      }
    )
  }

  const submitDisabled = createPost.isPending || isAttachingTags

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <form
        className="modal-panel"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">// NEW POST</h2>

        <div className="field">
          <label className="field-label">Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field-label">Content</label>
          <textarea
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />
        </div>

        <div className="field">
          <label className="field-label">Tags</label>
          <div className="field-row">
            <input
              className="input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={addPendingTag}
              disabled={!canAddTag}
            >
              + Tag
            </button>
          </div>
          {pendingTags.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {pendingTags.map((name) => (
                <TagChip key={name} name={name} onRemove={() => removePendingTag(name)} />
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={submitDisabled}>
            {createPost.isPending
              ? 'Creating...'
              : isAttachingTags
              ? 'Attaching...'
              : 'Create'}
          </button>
        </div>

        {createPost.isError && (
          <p className="error-text">Error: {formatError(createPost.error)}</p>
        )}
        {tagAttachErrors.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {tagAttachErrors.map((msg, i) => (
              <p key={i} className="error-text">{msg}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}
