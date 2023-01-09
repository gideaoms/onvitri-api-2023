import { Readable } from 'node:stream'
import * as Models from '@/core/models/mod.js'

export type Provider = {
  create(args: {
    readable: Readable
    width: number
    height?: number
    size: Models.Variant.Size
  }): Promise<Models.Variant.Model>
}
