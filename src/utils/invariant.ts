export function invariant(condition: unknown): asserts condition {
  if (!condition) {
    throw new Error(`${condition} is falsy`)
  }
}
