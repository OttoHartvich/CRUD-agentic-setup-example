import { generatedResolvers } from './generated/resolvers.generated.js'
import { customResolvers } from './custom/resolvers.custom.js'

// Deep-merge two levels: top-level resolver maps (Query, Mutation, type-level)
// and the field-level resolvers inside each map. Custom wins on conflict.
function mergeResolvers(
  base: Record<string, Record<string, unknown>>,
  override: Record<string, Record<string, unknown>>
): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = { ...base }
  for (const key of Object.keys(override)) {
    out[key] = { ...(base[key] ?? {}), ...override[key] }
  }
  return out
}

export const resolvers = mergeResolvers(
  generatedResolvers as Record<string, Record<string, unknown>>,
  customResolvers as Record<string, Record<string, unknown>>
)
