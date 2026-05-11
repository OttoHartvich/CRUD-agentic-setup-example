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
            // Keep modal open and preserve form state so the user can retry
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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 24, borderRadius: 8, width: 400 }}>
        <h2 style={{ marginTop: 0 }}>New Post</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Tags</label>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag"
              style={{ flex: 1, padding: 8 }}
            />
            <button type="button" onClick={addPendingTag} disabled={!canAddTag}>
              Add tag
            </button>
          </div>
          {pendingTags.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {pendingTags.map((name) => (
                <TagChip key={name} name={name} onRemove={() => removePendingTag(name)} />
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
          <button type="submit" disabled={submitDisabled}>
            {createPost.isPending ? 'Creating...' : isAttachingTags ? 'Attaching tags...' : 'Create'}
          </button>
        </div>
        {createPost.isError && (
          <p style={{ color: 'red', marginTop: 8 }}>Error: {formatError(createPost.error)}</p>
        )}
        {tagAttachErrors.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {tagAttachErrors.map((msg, i) => (
              <p key={i} style={{ color: 'red', margin: '4px 0' }}>{msg}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}
