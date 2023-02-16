import { Readable } from 'stream'
import fs from 'node:fs'
import crypto from 'node:crypto'
import * as DriveProvider from '@/core/providers/drive.js'
import * as StorageProvider from '@/core/providers/storage.js'
import * as GuardianProvider from '@/core/providers/guardian.js'
import * as Either from '@/utils/either.js'
import * as ImageModel from '@/core/models/image.js'
import * as ImageMapper from '@/core/mappers/image.js'

export class Service {
  constructor(
    private readonly _driveProvider: DriveProvider.Provider,
    private readonly _storageProvider: StorageProvider.Provider,
    private readonly _guardianProvider: GuardianProvider.Provider,
  ) {}

  async exec(normalReadableVariant: Readable, token: string) {
    const user = await this._guardianProvider.passThrough(token)
    if (Either.isFailure(user)) {
      return Either.failure(user.failure)
    }
    const normalDriveVariant = await this._driveProvider.create({
      readable: normalReadableVariant,
      width: 1000,
      size: 'normal',
    })
    const normalStorageVariant = await this._storageProvider.create(normalDriveVariant)
    const miniReadableVariant = fs.createReadStream(normalDriveVariant.url)
    const miniDriveVariant = await this._driveProvider.create({
      readable: miniReadableVariant,
      width: 200,
      height: 200,
      size: 'mini',
    })
    const miniStorageVariant = await this._storageProvider.create(miniDriveVariant)
    const image = ImageModel.build({
      id: crypto.randomUUID(),
      variants: [normalStorageVariant, miniStorageVariant],
    })
    await fs.promises.unlink(normalDriveVariant.url)
    await fs.promises.unlink(miniDriveVariant.url)
    return Either.success(ImageMapper.toObject(image))
  }
}
