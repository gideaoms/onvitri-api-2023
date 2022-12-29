import { City } from '@/core/city.js'
import { Either } from '@/utils/either.js'

type CityRepository = {
  findOne(cityId: string): Promise<Either<Error, City>>
  findManyByIds(cityIds: string[]): Promise<City[]>
}

export { CityRepository }
