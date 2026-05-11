type TagChipProps = {
  name: string
  onRemove?: () => void
  onClick?: () => void
}

export function TagChip({ name, onRemove, onClick }: TagChipProps) {
  return (
    <span
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation()
              onClick()
            }
          : undefined
      }
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        marginRight: 4,
        fontSize: 12,
        background: '#eef2ff',
        color: '#3730a3',
        border: '1px solid #c7d2fe',
        borderRadius: 999,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginLeft: 2,
            fontSize: 14,
            lineHeight: 1,
            color: '#3730a3',
          }}
          aria-label={`Remove tag ${name}`}
        >
          ×
        </button>
      )}
    </span>
  )
}
