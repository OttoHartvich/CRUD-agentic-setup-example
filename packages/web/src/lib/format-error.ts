import { ClientError } from 'graphql-request'

export function formatError(err: unknown): string {
  if (err instanceof ClientError) {
    return err.response.errors?.[0]?.message ?? err.message
  }
  return err instanceof Error ? err.message : String(err)
}
