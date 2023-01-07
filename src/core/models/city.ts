export class Model {
  readonly id: string
  readonly name: string
  readonly initials: string

  constructor(model: { id: string; name: string; initials: string }) {
    this.id = model.id
    this.name = model.name
    this.initials = model.initials
  }
}
