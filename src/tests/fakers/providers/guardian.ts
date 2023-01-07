import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Errors from '@/core/errors/mod.js'
import * as Models from '@/core/models/mod.js'

export class Provider implements Providers.Guardian.Provider {
  async passThrough(token: string) {
    const isValid = token === 'valid_token'
    if (!isValid) {
      return Either.failure(new Errors.Unauthorized.Error('Unauthorized'))
    }
    return Either.success(
      new Models.User.Model({
        id: '123',
        name: 'John Doe',
        email: 'john@mail.com',
        status: 'active',
        token: token,
        validationCode: null,
      }),
    )
  }
}
