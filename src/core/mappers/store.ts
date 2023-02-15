import * as Models from '@/core/models/mod.js'

export function toObject(model: Models.Store.Model) {
  return {
    id: model.id,
    city_id: model.cityId,
    owner_id: model.ownerId,
    fantasy_name: model.fantasyName,
    street: model.street,
    number: model.number,
    neighborhood: model.neighborhood,
    phone: {
      country_code: model.phone.countryCode,
      area_code: model.phone.areaCode,
      number: model.phone.number,
    },
    status: model.status,
  }
}
