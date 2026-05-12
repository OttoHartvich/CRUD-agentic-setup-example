import { useSetAtom } from 'jotai'
import { isCreateModalOpenAtom } from '../atoms/ui.atoms'

export function Layout({ children }: { children: React.ReactNode }) {
  const setCreateModalOpen = useSetAtom(isCreateModalOpenAtom)

  return (
    <div className="wrap">
      <header className="app-header">
        <div className="brand">
          <span className="dot" />
          <div>
            <h1>Mock // Blog</h1>
            <small>NODE-04 · SYS::ACTIVE</small>
          </div>
        </div>
        <button className="btn" onClick={() => setCreateModalOpen(true)}>
          + New Post
        </button>
      </header>
      <main>{children}</main>
      <div className="hud">SYNC OK · 12ms</div>
    </div>
  )
}
