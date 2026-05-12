type TagChipProps = {
  name: string
  active?: boolean
  onRemove?: () => void
  onClick?: () => void
}

export function TagChip({ name, active, onRemove, onClick }: TagChipProps) {
  const className = active ? 'tag active' : 'tag'
  return (
    <span
      className={className}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation()
              onClick()
            }
          : undefined
      }
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          className="tag-remove"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          aria-label={`Remove tag ${name}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
