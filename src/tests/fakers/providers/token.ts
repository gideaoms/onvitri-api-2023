import errors from 'http-errors'
import * as TokenProvider from '@/core/providers/token.js'
import * as Either from '@/utils/either.js'

export class Provider implements TokenProvider.Provider {
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
