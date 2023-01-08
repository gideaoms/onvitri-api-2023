import { Readable } from 'node:stream'
import * as Models from '@/core/models/mod.js'

export type Provider = {
  create(file: Readable): Promise<Models.Variant.Model>
}
