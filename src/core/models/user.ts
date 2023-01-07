export type Status = 'active' | 'inactive'

export class Model {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly validationCode: string | null
  readonly status: Status
  readonly token: string

  constructor(model: {
    id: string
    name: string
    email: string
    validationCode: string | null
    status: Status
    token: string
  }) {
    this.id = model.id
    this.name = model.name
    this.email = model.email
    this.validationCode = model.validationCode
    this.status = model.status
    this.token = model.token
  }

  isActive() {
    return this.status === 'active'
  }
}
