import * as VariantModel from '@/core/models/variant.js'

export type Provider = {
  create(variant: VariantModel.Model): Promise<VariantModel.Model>
  remove(variant: VariantModel.Model): Promise<void>
}
