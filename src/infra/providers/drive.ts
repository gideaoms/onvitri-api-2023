import stream from 'node:stream/promises'
import { Readable } from 'node:stream'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import sharp from 'sharp'
import * as DriveProvider from '@/core/providers/drive.js'
import * as VariantModel from '@/core/models/variant.js'

export class Provider implements DriveProvider.Provider {
  async create(args: {
    readable: Readable
    width: number
    height?: number
    size: VariantModel.Size
  }) {
    const extension = 'webp'
    const name = `${crypto.randomBytes(50).toString('hex')}.${extension}`
    const diskUrl = path.join(os.tmpdir(), name)
    const transformer = sharp({ failOn: 'none' })
      .resize({
        width: args.width,
        height: args.height,
        withoutEnlargement: !args.height,
      })
      .webp()
    await stream.pipeline(args.readable, transformer, fs.createWriteStream(diskUrl))
    const metadata = await sharp(diskUrl).metadata()
    if (!metadata.width || !metadata.height) {
      throw new Error('Error while getting width and height metadata')
    }
    return VariantModel.build({
      url: diskUrl,
      name: name,
      ext: extension,
      width: metadata.width,
      height: metadata.height,
      size: args.size,
      bucket: '',
    })
  }
}
