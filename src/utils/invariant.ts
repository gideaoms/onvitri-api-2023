import { InvariantError } from '@/core/errors/invariant.js'

function invariant(condition: unknown): asserts condition {
  if (!condition) throw new InvariantError()
}

export { invariant }
