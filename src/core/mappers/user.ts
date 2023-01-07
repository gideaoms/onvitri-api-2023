import * as Models from '@/core/models/mod.js'

export function toObject(model: Models.User.Model) {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    status: model.status,
    token: model.token,
  }
}
