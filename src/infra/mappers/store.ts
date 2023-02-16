import { z } from 'zod'
import { Store } from '@prisma/client'
import * as StoreModel from '@/core/models/store.js'

const schema = z.object({
  country_code: z.string(),
  area_code: z.string(),
  number: z.string(),
})

export function toModel(record: Store) {
  const parsed = schema.parse(record.phone)
  return StoreModel.build({
    id: record.id,
    cityId: record.city_id,
    ownerId: record.owner_id,
    fantasyName: record.fantasy_name,
    neighborhood: record.neighborhood,
    number: record.number,
    status: record.status,
    street: record.street,
    phone: {
      countryCode: parsed.country_code,
      areaCode: parsed.area_code,
      number: parsed.number,
    },
  })
}

export function toObject(record: Store) {
  const parsed = schema.parse(record.phone)
  return {
    id: record.id,
    city_id: record.city_id,
    fantasy_name: record.fantasy_name,
    street: record.street,
    number: record.number,
    neighborhood: record.neighborhood,
    phone: {
      country_code: parsed.country_code,
      area_code: parsed.area_code,
      number: parsed.number,
    },
    status: record.status,
  }
}
