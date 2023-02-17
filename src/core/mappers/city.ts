import * as CityModel from '@/core/models/city.js'

export function toObject(model: CityModel.Model) {
  return {
    id: model.id,
    name: model.name,
    initials: model.initials,
  }
}
