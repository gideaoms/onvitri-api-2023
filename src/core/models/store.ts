export type Status = 'active' | 'inactive'

export type Phone = {
  countryCode: string
  areaCode: string
  number: string
}

export class Model {
  readonly id: string
  readonly cityId: string
  readonly fantasyName: string
  readonly street: string
  readonly number: string
  readonly neighborhood: string
  readonly phone: Phone
  readonly status: Status

  constructor(model: {
    id: string
    cityId: string
    fantasyName: string
    street: string
    number: string
    neighborhood: string
    phone: Phone
    status: Status
  }) {
    this.id = model.id
    this.cityId = model.cityId
    this.fantasyName = model.fantasyName
    this.street = model.street
    this.number = model.number
    this.neighborhood = model.neighborhood
    this.phone = model.phone
    this.status = model.status
  }
}
