export class City {
  public readonly id: string
  public readonly name: string
  public readonly initials: string

  public constructor(city: { id: string; name: string; initials: string }) {
    this.id = city.id
    this.name = city.name
    this.initials = city.initials
  }
}
