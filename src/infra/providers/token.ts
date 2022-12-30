import jsonwebtoken from 'jsonwebtoken'
import { ITokenProvider } from '@/core/providers/token.js'
import { Config } from '@/config.js'
import { Either, failure, success } from '@/utils/either.js'
import { UnauthorizedError } from '@/core/errors/unauthorized.js'

export class TokenProvider implements ITokenProvider {
  public generate(sub: string) {
    return jsonwebtoken.sign({ sub }, Config.TOKEN_SECRET, {
      expiresIn: Config.TOKEN_EXPIRES_IN,
    })
  }

  public verify(token: string): Either<Error, string> {
    try {
      const decoded = jsonwebtoken.verify(token, Config.TOKEN_SECRET)
      return success(String(decoded.sub))
    } catch {
      return failure(new UnauthorizedError('Invalid token'))
    }
  }
}
