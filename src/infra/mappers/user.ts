import { User } from '@prisma/client'
import * as Models from '@/core/models/mod.js'

export function toModel(record: User) {
  return new Models.User.Model({
    id: record.id,
    email: record.email,
    name: record.name,
    status: record.status,
    validationCode: record.validation_code,
    token: '',
  })
}
