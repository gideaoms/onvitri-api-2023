import jsonwebtoken from 'jsonwebtoken'
import errors from 'http-errors'
import config from '@/config.js'
import * as TokenProvider from '@/core/providers/token.js'
import * as Either from '@/utils/either.js'

export class Provider implements TokenProvider.Provider {
  generate(sub: string) {
    return jsonwebtoken.sign({ sub }, config.TOKEN_SECRET, {
      expiresIn: config.TOKEN_EXPIRES_IN,
    })
  }

  verify(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, config.TOKEN_SECRET)
      return Either.success(String(decoded.sub))
    } catch {
      return Either.failure(new errors.Unauthorized('Invalid token'))
    }
  }
}
