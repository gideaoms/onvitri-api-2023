import * as Models from '@/core/models/mod.js'

export type Provider = {
  create(variant: Models.Variant.Model): Promise<Models.Variant.Model>
}
