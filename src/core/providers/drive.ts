import { Readable } from 'node:stream'
import * as VariantModel from '@/core/models/variant.js'

export type Provider = {
  create(params: {
    readable: Readable
    width: number
    height?: number
    size: VariantModel.Size
  }): Promise<VariantModel.Model>
}
