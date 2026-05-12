import { useState } from 'react'
import { useListTags, useCreateTag } from '../hooks/generated/tag.hooks'
import { formatError } from '../lib/format-error'
import { TagChip } from './TagChip'

export function TagManager() {
  const [name, setName] = useState('')

  const { data, isLoading, error: listError } = useListTags()
  const createTag = useCreateTag()

  const tags = data?.tags ?? []
  const trimmed = name.trim()

  const handleSubmit = () => {
    if (!trimmed) return
    createTag.mutate(
      { input: { name: trimmed } },
      {
        onSuccess: () => {
          setName('')
        },
      },
    )
  }

  return (
    <div className="panel">
      <h3 className="panel-title">// TAGS</h3>

      <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {isLoading && (
          <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            // loading tags...
          </span>
        )}
        {listError && (
          <span className="error-text" style={{ margin: 0 }}>
            Error loading tags: {formatError(listError)}
          </span>
        )}
        {!isLoading && !listError && tags.length === 0 && (
          <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            // no tags yet
          </span>
        )}
        {tags.map((tag) => (
          <TagChip key={tag.id} name={tag.name} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="field-row"
      >
        <input
          className="input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (createTag.error) {
              createTag.reset()
            }
          }}
          placeholder="New tag name"
          style={{ flex: 1, maxWidth: 280 }}
        />
        <button
          type="submit"
          className="btn btn-ghost"
          disabled={createTag.isPending || trimmed.length === 0}
        >
          {createTag.isPending ? 'Creating...' : '+ Create'}
        </button>
      </form>

      {createTag.error && (
        <p className="error-text">{formatError(createTag.error)}</p>
      )}
    </div>
  )
}
