export type Variant = {
  url: string
  name: string
  ext: string
  width: number
  height: number
  size: 'sm' | 'md'
}

export class Model {
  readonly id: string
  readonly variants: Variant[]

  constructor(model: { id: string; variants: Variant[] }) {
    this.id = model.id
    this.variants = model.variants
  }
}
