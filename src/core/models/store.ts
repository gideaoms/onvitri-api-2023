import * as CityModel from '@/core/models/city.js'

export type Status = 'active' | 'inactive'

export type Phone = {
  countryCode: string
  areaCode: string
  number: string
}

export type Model = Readonly<{
  id: string
  cityId: string
  ownerId: string
  fantasyName: string
  street: string
  number: string
  neighborhood: string
  phone: Phone
  status: Status
  city: CityModel.Model
}>

export function build(model: Model) {
  return model
}
