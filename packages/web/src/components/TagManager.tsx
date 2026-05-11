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
    <div
      style={{
        marginBottom: 16,
        padding: 12,
        border: '1px solid #ddd',
        borderRadius: 8,
      }}
    >
      <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>Tags</h3>

      <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {isLoading && <span style={{ fontSize: 12, color: '#666' }}>Loading tags...</span>}
        {listError && (
          <span style={{ fontSize: 12, color: '#b91c1c' }}>
            Error loading tags: {formatError(listError)}
          </span>
        )}
        {!isLoading && !listError && tags.length === 0 && (
          <span style={{ fontSize: 12, color: '#666' }}>No tags yet.</span>
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
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (createTag.error) {
              createTag.reset()
            }
          }}
          placeholder="New tag name"
          style={{
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: 6,
            fontSize: 14,
            flex: 1,
            maxWidth: 240,
          }}
        />
        <button
          type="submit"
          disabled={createTag.isPending || trimmed.length === 0}
          style={{
            padding: '6px 12px',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: createTag.isPending ? '#f3f4f6' : '#fff',
            cursor: createTag.isPending ? 'not-allowed' : 'pointer',
            fontSize: 12,
          }}
        >
          {createTag.isPending ? 'Creating...' : 'Create'}
        </button>
      </form>

      {createTag.error && (
        <p
          style={{
            margin: '6px 0 0',
            fontSize: 12,
            color: '#b91c1c',
          }}
        >
          {formatError(createTag.error)}
        </p>
      )}
    </div>
  )
}
