import { City } from '@/core/city.js'
import { NotFoundError } from '@/core/errors/not-found.js'
import { CityRepository } from '@/core/repositories/city.js'
import { prisma } from '@/infra/libs/prisma.js'
import { failure, success } from '@/utils/either.js'

class PrismaCityRepository implements CityRepository {
  public async findOne(cityId: string) {
    const city = await prisma.city.findUnique({
      where: {
        id: cityId,
      },
    })
    if (!city) {
      return failure(new NotFoundError('City not found'))
    }
    return success(new City({ id: city.id, name: city.name, initials: city.initials }))
  }

  public async findManyByIds(cityIds: string[]) {
    const cities = await prisma.city.findMany({
      where: {
        id: {
          in: cityIds,
        },
      },
    })
    return cities.map(city => new City({ id: city.id, name: city.name, initials: city.initials }))
  }
}

export { PrismaCityRepository }
