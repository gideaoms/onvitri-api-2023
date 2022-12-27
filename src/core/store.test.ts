import { describe, expect, it } from 'vitest'
import { Store } from '@/core/store.js'

describe('Store', () => {
  it('should do something', () => {
    const store = new Store({ id: '123', status: 'active' })
    expect(store).instanceOf(Store)
    expect(store.id).toBe('123')
  })
})
