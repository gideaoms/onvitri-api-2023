import { City } from '@prisma/client'

export function toObject(record: City) {
  return {
    id: record.id,
    name: record.name,
    initials: record.initials,
  }
}
