import * as UserModel from '@/core/models/user.js'

export function toObject(model: UserModel.Model) {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    status: model.status,
    token: model.token,
  }
}
