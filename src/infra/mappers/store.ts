import { Store } from '@prisma/client'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import * as Models from '@/core/models/mod.js'

const PhoneSchema = Type.Object({
  country_code: Type.String(),
  area_code: Type.String(),
  number: Type.String(),
})

export function toModel(record: Store) {
  if (!Value.Check(PhoneSchema, record.phone)) {
    throw new Error('Invalid phone field')
  }
  return new Models.Store.Model({
    id: record.id,
    cityId: record.city_id,
    fantasyName: record.fantasy_name,
    neighborhood: record.neighborhood,
    number: record.number,
    status: record.status,
    street: record.street,
    phone: {
      countryCode: record.phone.country_code,
      areaCode: record.phone.area_code,
      number: record.phone.number,
    },
  })
}

export function toObject(record: Store) {
  if (!Value.Check(PhoneSchema, record.phone)) {
    throw new Error('Invalid phone field')
  }
  return {
    id: record.id,
    city_id: record.city_id,
    fantasy_name: record.fantasy_name,
    street: record.street,
    number: record.number,
    neighborhood: record.neighborhood,
    phone: {
      country_code: record.phone.country_code,
      area_code: record.phone.area_code,
      number: record.phone.number,
    },
    status: record.status,
  }
}
