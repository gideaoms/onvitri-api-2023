import { CityRepository } from '@/core/repositories/city.js'
import { ProductRepository } from '@/core/repositories/product.js'
import { StoreRepository } from '@/core/repositories/store.js'
import { failure, isFailure, success } from '@/utils/either.js'

class FindOne {
  private readonly storeRepository: StoreRepository
  private readonly cityRepository: CityRepository
  private readonly productRepository: ProductRepository

  public constructor(
    storeRepository: StoreRepository,
    cityRepository: CityRepository,
    productRepository: ProductRepository,
  ) {
    this.storeRepository = storeRepository
    this.cityRepository = cityRepository
    this.productRepository = productRepository
  }

  public async exec(storeId: string) {
    const store = await this.storeRepository.findOne(storeId)
    if (isFailure(store)) {
      return failure(store.failure)
    }
    const city = await this.cityRepository.findOne(store.success.cityId)
    if (isFailure(city)) {
      return failure(city.failure)
    }
    const products = await this.productRepository.findManyByStore(store.success.id)
    return success({
      id: store.success.id,
      city_id: store.success.cityId,
      status: store.success.status,
      city: {
        id: city.success.id,
        name: city.success.name,
        initials: city.success.initials,
      },
      products: products.map(product => ({
        id: product.id,
        description: product.description,
      })),
    })
  }
}

export { FindOne }
