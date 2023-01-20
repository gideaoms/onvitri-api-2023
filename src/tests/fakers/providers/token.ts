import errors from 'http-errors'
import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'

export class Provider implements Providers.Token.Provider {
  generate() {
    return 'valid_token'
  }

  verify(token: string) {
    const isValid = token === 'valid_token'
    if (!isValid) {
      return Either.failure(new errors.Unauthorized('Invalid token'))
    }
    return Either.success('valid_sub')
  }
}
