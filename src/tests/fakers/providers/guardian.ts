import errors from 'http-errors'
import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Models from '@/core/models/mod.js'

export class Provider implements Providers.Guardian.Provider {
  async passThrough(token: string) {
    const isValid = token === 'valid_token'
    if (!isValid) {
      return Either.failure(new errors.Unauthorized())
    }
    return Either.success(
      Models.User.build({
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
