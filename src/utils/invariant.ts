import * as Errors from '@/core/errors/mod.js'

export function invariant(condition: unknown): asserts condition {
  if (!condition) {
    throw new Errors.Invariant.Error()
  }
}
