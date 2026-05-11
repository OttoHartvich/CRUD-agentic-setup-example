import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { queryClient } from './lib/query-client'
import { Layout } from './components/Layout'
import { PostList } from './components/PostList'
import { PostForm } from './components/PostForm'
import { CommentSection } from './components/CommentSection'
import { TagManager } from './components/TagManager'

export function App() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <TagManager />
          <PostList />
          <PostForm />
          <CommentSection />
        </Layout>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
