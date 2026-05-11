import { useSetAtom } from 'jotai'
import { isCreateModalOpenAtom } from '../atoms/ui.atoms'

export function Layout({ children }: { children: React.ReactNode }) {
  const setCreateModalOpen = useSetAtom(isCreateModalOpenAtom)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Mock Blog</h1>
        <button onClick={() => setCreateModalOpen(true)}>New Post</button>
      </header>
      <main>{children}</main>
    </div>
  )
}
