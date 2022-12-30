import jsonwebtoken from 'jsonwebtoken'
import { ITokenProvider } from '@/core/providers/token.js'
import { Config } from '@/config.js'

export class TokenProvider implements ITokenProvider {
  public generate(sub: string) {
    return jsonwebtoken.sign({ sub }, Config.TOKEN_SECRET, {
      expiresIn: Config.TOKEN_EXPIRES_IN,
    })
  }
}
