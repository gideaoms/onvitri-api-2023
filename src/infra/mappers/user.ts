import { User } from '@prisma/client'
import * as Models from '@/core/models/mod.js'

export function toModel(record: User) {
  return Models.User.build({
    id: record.id,
    email: record.email,
    name: record.name,
    status: record.status,
    validationCode: record.validation_code ?? undefined,
    defaultStoreId: record.default_store_id ?? undefined,
    token: '',
  })
}

export function fromModel(model: Models.User.Model) {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    validation_code: model.validationCode ?? null,
    status: model.status,
    default_store_id: model.defaultStoreId ?? null,
  } satisfies Omit<User, 'created_at' | 'updated_at'>
}
