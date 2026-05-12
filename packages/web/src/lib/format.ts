export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = pad2(d.getMonth() + 1)
  const day = pad2(d.getDate())
  return `${y}.${m}.${day}`
}

export function authorHandle(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '.')
}
