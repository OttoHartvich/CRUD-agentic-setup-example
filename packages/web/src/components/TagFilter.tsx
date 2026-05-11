import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { activeTagFilterAtom } from '../atoms/ui.atoms'

export function TagFilter() {
  const [activeTag, setActiveTag] = useAtom(activeTagFilterAtom)
  const [inputValue, setInputValue] = useState(activeTag)

  useEffect(() => {
    if (activeTag !== inputValue) {
      setInputValue(activeTag)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTag])

  useEffect(() => {
    if (inputValue === activeTag) return
    const handle = setTimeout(() => {
      setActiveTag(inputValue)
    }, 300)
    return () => clearTimeout(handle)
  }, [inputValue, activeTag, setActiveTag])

  return (
    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Filter by tag…"
        style={{
          padding: '6px 10px',
          border: '1px solid #ddd',
          borderRadius: 6,
          fontSize: 14,
          flex: 1,
          maxWidth: 240,
        }}
      />
      {inputValue && (
        <button
          type="button"
          onClick={() => {
            setInputValue('')
            setActiveTag('')
          }}
          style={{
            padding: '6px 10px',
            border: '1px solid #ddd',
            borderRadius: 6,
            background: '#fff',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Clear
        </button>
      )}
    </div>
  )
}
