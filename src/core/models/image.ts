import * as Variant from '@/core/models/variant.js'

export class Model {
  readonly id: string
  readonly variants: Variant.Model[]

  constructor(model: { id: string; variants: Variant.Model[] }) {
    this.id = model.id
    this.variants = model.variants
  }
}
