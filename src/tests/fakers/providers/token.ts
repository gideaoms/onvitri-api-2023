import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Errors from '@/core/errors/mod.js'

export class Provider implements Providers.Token.Provider {
  generate() {
    return 'valid_token'
  }

  verify(token: string) {
    const isValid = token === 'valid_token'
    if (!isValid) {
      return Either.failure(new Errors.Unauthorized.Error('Invalid token'))
    }
    return Either.success('valid_sub')
  }
}
