import * as VariantModel from '@/core/models/variant.js'

export type Model = Readonly<{
  id: string
  variants: VariantModel.Model[]
}>

export function build(model: Model) {
  return model
}
