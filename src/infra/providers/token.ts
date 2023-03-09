import jsonwebtoken from 'jsonwebtoken'
import errors from 'http-errors'
import Config from '@/config.js'
import * as TokenProvider from '@/core/providers/token.js'
import * as Either from '@/utils/either.js'

export class Provider implements TokenProvider.Provider {
  generate(sub: string) {
    return jsonwebtoken.sign({ sub }, Config.TOKEN_SECRET, {
      expiresIn: Config.TOKEN_EXPIRES_IN,
    })
  }

  verify(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, Config.TOKEN_SECRET)
      return Either.success(String(decoded.sub))
    } catch {
      return Either.failure(new errors.Unauthorized('Invalid token'))
    }
  }
}
