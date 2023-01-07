import jsonwebtoken from 'jsonwebtoken'
import * as Config from '@/config.js'
import * as Providers from '@/core/providers/mod.js'
import * as Either from '@/utils/either.js'
import * as Errors from '@/core/errors/mod.js'

export class Provider implements Providers.Token.Provider {
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
      return Either.failure(new Errors.Unauthorized.Error('Invalid token'))
    }
  }
}
