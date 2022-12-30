export declare namespace User {
  type Status = 'active' | 'inactive'
}

export class User {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly validationCode: string | null
  public readonly status: User.Status

  public constructor(user: {
    id: string
    name: string
    email: string
    validationCode: string | null
    status: User.Status
  }) {
    this.id = user.id
    this.name = user.name
    this.email = user.email
    this.validationCode = user.validationCode
    this.status = user.status
  }
}
