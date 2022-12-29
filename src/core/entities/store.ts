declare namespace Store {
  type Status = 'active' | 'inactive'
}

class Store {
  public readonly id: string
  public readonly cityId: string
  public readonly status: Store.Status

  public constructor(store: { id: string; cityId: string; status: Store.Status }) {
    this.id = store.id
    this.cityId = store.cityId
    this.status = store.status
  }
}

export { Store }
