import { CityRepository } from '@/core/repositories/city.js'
import { StoreRepository } from '@/core/repositories/store.js'
import { invariant } from '@/utils/invariant.js'

class FindMany {
  private readonly storeRepository: StoreRepository
  private readonly cityRepository: CityRepository

  public constructor(storeRepository: StoreRepository, cityRepository: CityRepository) {
    this.storeRepository = storeRepository
    this.cityRepository = cityRepository
  }

  public async exec(page: number) {
    const stores = await this.storeRepository.findMany(page)
    const cityIds = stores.map(store => store.cityId)
    const cities = await this.cityRepository.findManyByIds(cityIds)
    return stores.map(store => {
      const city = cities.find(city => city.id === store.cityId)
      invariant(city)
      return {
        id: store.id,
        status: store.status,
        city: {
          id: city.id,
          name: city.name,
          initials: city.id,
        },
      }
    })
  }
}

export { FindMany }
