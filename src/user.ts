declare namespace User {
  type Status = 'I' | 'A'
  type Role = 'admin' | 'common'
}

class User {
  public readonly name: string
  public readonly status: User.Status
  public readonly roles: User.Role[]

  public constructor(user: { name: string; status: User.Status; roles: User.Role[] }) {
    this.name = user.name
    this.status = user.status
    this.roles = user.roles
  }

  public isActive(): boolean {
    return this.status === 'A'
  }

  public toActive(): User {
    return new User({ ...this, status: 'A' })
  }

  public isAdmin(): boolean {
    return Boolean(this.roles.find(role => role === 'admin'))
  }

  public toAdmin(): User | Error {
    if (this.isAdmin()) {
      return new Error('This user is already an admin')
    }
    return new User({ ...this, roles: [...this.roles, 'admin'] })
  }
}

export { User }
