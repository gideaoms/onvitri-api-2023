import { User } from '@/core/entities/user.js'
import { UnauthorizedError } from '@/core/errors/unauthorized.js'
import { IGuardianProvider } from '@/core/providers/guardian.js'
import { ITokenProvider } from '@/core/providers/token.js'
import { IUserRepository } from '@/core/repositories/user.js'
import { failure, isFailure, success } from '@/utils/either.js'

export class GuardianProvider implements IGuardianProvider {
  private readonly tokenProvider: ITokenProvider
  private readonly userRepository: IUserRepository

  public constructor(tokenProvider: ITokenProvider, userRepository: IUserRepository) {
    this.tokenProvider = tokenProvider
    this.userRepository = userRepository
  }

  public async passThrough(token: string) {
    if (!token) {
      return failure(new UnauthorizedError('Unauthorized'))
    }
    const [, rawToken] = token.split(' ')
    if (!rawToken) {
      return failure(new UnauthorizedError('Unauthorized'))
    }
    const userId = this.tokenProvider.verify(rawToken)
    if (isFailure(userId)) {
      return failure(new UnauthorizedError('Unauthorized'))
    }
    const user = await this.userRepository.findById(userId.success)
    if (isFailure(user)) {
      return failure(new UnauthorizedError('Unauthorized'))
    }
    if (!user.success.isActive()) {
      return failure(new UnauthorizedError('O seu perfil não está ativo na plataforma'))
    }
    return success(new User({ ...user.success, token: rawToken }))
  }
}
