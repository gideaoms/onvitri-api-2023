import * as Variant from '@/core/models/variant.js'

export type Model = Readonly<{
  id: string
  variants: Variant.Model[]
}>

export function build(model: Model) {
  return model
}
