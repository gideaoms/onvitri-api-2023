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
}

export { User }
