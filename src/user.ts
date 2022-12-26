declare namespace User {
  type Status = 'I' | 'A'
}

class User {
  public readonly name: string
  public readonly status: User.Status

  public constructor(user: { name: string; status: User.Status }) {
    this.name = user.name
    this.status = user.status
  }

  public isActive(): boolean {
    return this.status === 'A'
  }

  public toActive(): User {
    return new User({ ...this, status: 'A' })
  }
}

export { User }
