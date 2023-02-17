import * as StoreModel from '@/core/models/store.js'
import * as CityMapper from '@/core/mappers/city.js'

export function toObject(model: StoreModel.Model) {
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
    city: CityMapper.toObject(model.city),
  }
}
