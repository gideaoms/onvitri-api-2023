import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Mappers from '@/core/mappers/mod.js'

export class Service {
  constructor(private readonly _guardianProvider: Providers.Guardian.Provider) {}

  async exec(token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    return Either.success(Mappers.User.toObject(user.success))
  }
}
