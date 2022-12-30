import { BadRequestError } from '@/core/errors/bad-request.js'
import { ITokenProvider } from '@/core/providers/token.js'
import { IUserRepository } from '@/core/repositories/user.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class CreateSession {
  private readonly userRepository: IUserRepository
  private readonly tokenProvider: ITokenProvider

  public constructor(userRepository: IUserRepository, tokenProvider: ITokenProvider) {
    this.userRepository = userRepository
    this.tokenProvider = tokenProvider
  }

  public async exec(email: string, validationCode: string) {
    const message = 'Email e/ou código incorretos'
    const user = await this.userRepository.findByEmail(email)
    if (isFailure(user)) {
      return failure(new BadRequestError(message))
    }
    const isValidationCodeCorrect = user.success.validationCode === validationCode
    if (!isValidationCodeCorrect) {
      return failure(new BadRequestError(message))
    }
    const generatedToken = this.tokenProvider.generate(user.success.id)
    return success({
      id: user.success.id,
      name: user.success.name,
      email: user.success.email,
      status: user.success.status,
      token: generatedToken,
    })
  }
}
