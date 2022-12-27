declare namespace Store {
  type Status = 'active' | 'inactive' | 'awaiting' | 'blocked'
}

class Store {
  public readonly id: string
  public readonly status: Store.Status

  public constructor(store: { id: string; status: Store.Status }) {
    this.id = store.id
    this.status = store.status
  }

  public isActive(): boolean {
    return this.status === 'active'
  }
}

export { Store }
